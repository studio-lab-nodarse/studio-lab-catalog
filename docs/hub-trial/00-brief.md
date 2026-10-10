# Hub trial — Phase 0 brief

Status: **draft, awaiting owner approval** · 2026-10-10

## Goal

Turn the storefront hub (`/apps/storefront/`) into a page that convinces **South Florida tourist-area shops** to request a **free trial box**, then turn trial boxes into wholesale orders.

**North-star metric:** trial boxes that become a paid order.
**Page metric:** hub visits → trial requests.

## Audience

Gift, souvenir and tourist shops in South Florida tourist cities (Miami Beach, Key West, Fort Lauderdale, etc.). They are often reading on a phone, between customers. They want three things answered fast: does it sell, what does it cost me, how do I start.

## The offer

1. A shop requests a trial box on the hub. The form asks for **contact details and a shipping address only**.
2. The request lands in the owner's **email** via FormSubmit (the same pipe as orders). **The owner reviews each request by hand** before shipping. The copy says "request", not "claim", so it never promises a box.
3. The box ships with a batch of products **plus a card with a QR code**.
4. The QR opens a **reorder page** that has:
   - a one-tap **prefilled email** (store name and box code already filled in);
   - a WhatsApp button as backup.
   The QR goes to a web page rather than straight to `mailto:` because a page works on every phone (many have no mail app set up), can be tracked, and can be changed after the cards are printed.
5. Each box gets a short code (e.g. `?box=MB-014`), so the owner knows which shop is reordering.

## Pages

| Page | Purpose | Notes |
|---|---|---|
| Hub (rebuilt) | Show the products, show the numbers, request the trial box | Becomes an Eleventy template; it replaces the frozen React bundle in `src/_vendor/hub.html`. The current text and images get pulled out of the bundle and reused. |
| Trial request form | Contact details + address → email | Part of the hub page or its own step. Accept South Florida ZIPs only. Hidden spam trap. Short privacy note. |
| Reorder page (QR target) | Prefilled email + WhatsApp | Reads `?box=`. Never linked in the nav, and blocked from search engines (`noindex`). |

## Form fields (draft)

Required: contact name, store name, email, phone/WhatsApp, street address, city, ZIP.
Optional: store type, Instagram or website (lets the owner vet the shop quickly).
Not asked: tax ID, resale certificate, payment details.

## Proof / numbers

Real figures only, supplied by the owner (Jesús). Candidates: stores carrying the products, units sold, reorder rate, years in business, number of designs. Mockups use clearly marked placeholders until the real figures arrive.

## Analytics

Must be simple and privacy-friendly, with no cookie banner. **Not PostHog** (that account belongs to Camilo's work). Recommendation: **GoatCounter** (free, publishes an SRI hash, so it passes the CI rule that every external script must carry one).
Things to track: hub views, trial-form submits, reorder-page views per `box`, prefilled-email clicks.

## Constraints

- Static hosting on GitHub Pages; no backend.
- **FormSubmit must be activated** before launch (still listed as an owner action in `BACKLOG.md`).
- Ships English first, with the EN/ES toggle; uses the shared masthead and footer.
- `verify_site.py` must stay green and gets extended to cover the new form and pages.
- The rebuilt hub must still deliver what the old hub did: links to the collection pages, a wholesale contact, SEO tags and JSON-LD.

## Out of scope (v1)

Store-data or POS integrations, a CRM, online payment, an automated approval step.

## Open (needs the owner / Jesús)

- What goes in the box: which products, how many units?
- How many boxes per month can be given away (a cap)?
- What happens after the trial: keep it free, or invoice if they reorder?
- The real proof numbers.
