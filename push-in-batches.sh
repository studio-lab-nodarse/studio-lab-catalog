#!/usr/bin/env bash
# Land the branch on the remote without rewriting history.
#
# WHY: commit e1c3cbe ("externalizar imágenes base64") adds 16.3 MB across 400
# objects in one go, and that single pack reliably kills the connection
# ("send-pack: unexpected disconnect while reading sideband packet"). Everything
# smaller pushes fine — 9 commits already landed one at a time.
#
# HOW: git objects accumulate on the server independently of refs. So we upload
# the image blobs first, in batches, via a throwaway ref. By the time we push
# the real commit, the server already has its blobs and the pack is tiny.
# No history is rewritten; every commit keeps its SHA.
#
# Safe to re-run: each step is idempotent and stops on first failure.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

BRANCH="refs/heads/cami/folder-structure-org-3f2f9f"
BASE="114c15c"      # last commit already on the remote
BIG="e1c3cbe"       # the commit that won't push in one piece
TMPREF="refs/heads/tmp-blobs"
BATCHES=20          # ~20 files per push; larger packs drop the connection

PUSH="git -c pack.threads=1 -c core.compression=1 push --no-thin"

# The remote drops sustained uploads intermittently, so retry each push a few
# times before giving up. Every step is idempotent, so a retry is always safe.
try_push() {
  local attempt
  for attempt in 1 2 3 4 5; do
    if "$@" 2>/dev/null; then return 0; fi
    sleep $((attempt * 3))
  done
  return 1
}

echo "==> pre-uploading image blobs in $BATCHES batches via $TMPREF"
# portable read loop — macOS ships bash 3.2, which has no `mapfile`
FILES=()
while IFS= read -r line; do FILES+=("$line"); done < <(git diff --name-only "$BASE" "$BIG" -- assets/img)
TOTAL=${#FILES[@]}
echo "    $TOTAL image files to pre-upload"
PER=$(( (TOTAL + BATCHES - 1) / BATCHES ))

for ((b=1; b<=BATCHES; b++)); do
  COUNT=$(( b * PER )); (( COUNT > TOTAL )) && COUNT=$TOTAL
  IDX="$(mktemp)"; rm -f "$IDX"
  export GIT_INDEX_FILE="$IDX"
  git read-tree "$BASE"
  # stage a cumulative subset straight out of the target commit
  for ((i=0; i<COUNT; i++)); do
    f="${FILES[$i]}"
    sha="$(git rev-parse "$BIG:$f")"
    git update-index --add --cacheinfo "100644,$sha,$f"
  done
  TREE="$(git write-tree)"
  COMMIT="$(git commit-tree "$TREE" -p "$BASE" -m "temp: blob upload batch $b")"
  unset GIT_INDEX_FILE; rm -f "$IDX"

  echo "    batch $b/$BATCHES ($COUNT/$TOTAL files cumulative)"
  if try_push $PUSH -q --force origin "$COMMIT:$TMPREF"; then
    :
  else
    echo "    batch $b failed after retries - rerun the script, it resumes" >&2
    exit 1
  fi
done
echo "    all blobs uploaded"

echo "==> pushing the real commits one at a time"
for sha in $(git rev-list --reverse "$BASE..HEAD"); do
  short="$(git rev-parse --short "$sha")"
  printf '    %s  %s\n' "$short" "$(git log -1 --format=%s "$sha" | cut -c1-48)"
  if ! try_push $PUSH -q origin "$sha:$BRANCH"; then
    echo "    failed at $short after retries - rerun the script, it resumes" >&2
    exit 1
  fi
done

echo "==> cleaning up the throwaway ref"
git push -q origin --delete "$TMPREF" || true

echo
echo "Branch is fully on the remote."
echo "Remote branch: $(git ls-remote origin "$BRANCH" | cut -c1-8)"
echo
echo "Production is still untouched. To deploy, run ONE of:"
echo
echo "  # open a PR (recommended - CI validates before production):"
echo "  gh pr create --base main --head cami/folder-structure-org-3f2f9f --fill"
echo
echo "  # or publish immediately:"
echo "  git push origin HEAD:main"
