# Backlog

Outstanding items. The remediation phases (P1–P4) are done; see [REMEDIATION-PLAN.md](REMEDIATION-PLAN.md) for detail and [SITE-CONFIG.md](SITE-CONFIG.md) for constants.

## 🚦 Owner actions — required before go-live
- [ ] **Activate FormSubmit.** Orders POST to `formsubmit.co/ajax/jesusnodarse1823@gmail.com`, which needs a one-time confirmation. Submit one test order → click the activation link FormSubmit emails to that inbox. Until then, orders fall back to opening the mail client / WhatsApp (nothing lost, but not captured to inbox).
- [ ] **Branch protection on `main`.** Enable it and mark the "Verify site" check as required, so a red CI (`tools/verify_site.py`) actually blocks the merge/deploy. GitHub repo setting — cannot be done in a file.

## 🔜 Should do soon
- [ ] Push branch `cami/folder-structure-org-3f2f9f` and open a PR (12 commits, currently unpushed).
- [ ] Switch FormSubmit to its **hashed alias endpoint** so the order email isn't exposed in client JS (needs one-time FormSubmit setup).
- [ ] After go-live, submit a real test order end-to-end and confirm it lands in the inbox.

## 🧊 Deferred / nice-to-have
- [ ] `loading="lazy"` + `width`/`height` on product images (they're JS-rendered → means editing the React factory; smaller win now that payload is external).
- [ ] Subset Google Fonts (Playfair Display, Archivo).
- [ ] Visible breadcrumb `<a>` links (structured `BreadcrumbList` already shipped).
- [ ] Product-level `Product`/`ItemList` schema with `offers` — only if the store ever publishes prices (today it's order-to-quote, no prices).
- [ ] Descriptive image filenames for image SEO (currently content-hash names).

## 🌱 Post-MVP
- [ ] Real order backend / capture beyond email (dashboard, order records).
- [ ] Custom domain (no CNAME today; running on `*.github.io`).
- [ ] Source-of-truth pipeline: a re-apply step so SEO/order/asset work survives if the owner regenerates a page from the AI builder (currently the files are **frozen** — see CLAUDE.md).
