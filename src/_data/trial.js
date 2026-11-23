// The ONLY reader of process.env for the trial page. Values are GitHub repo
// Variables in CI and a git-ignored .env locally (see .env.example). Every value
// ends up public on the page, so none of them are secrets.
//
// Rule: an EMPTY variable hides its block or line. A malformed one fails the
// build, so a typo can never ship as "NaN%" or "$abc".

const INT = /^\d{1,6}$/;
const COUNT = /^\d{1,3}(,?\d{3})*\+?$/;                       // 16,000+ · 137
const PRICE = /^\d+(\.\d{2})?([–-]\d+(\.\d{2})?)?$/;          // 2.99 · 7.99–9.99
const PCT = /^(100|[1-9]?\d)$/;

const SPEC = {
  PROOF_STORES: INT,
  PROOF_UNITS_SOLD: COUNT,
  PROOF_REORDER_RATE: PCT,
  PROOF_YEARS: /^\d{1,2}\+?$/,
  PROOF_SHOPS: /^[^|;]+(\|[^|;]*)?(;[^|;]+(\|[^|;]*)?)*;?\s*$/, // Name|Area; Name|Area
  PROOF_QUOTE: null,
  PROOF_QUOTE_ES: null,
  PROOF_QUOTE_BY: null,
  PRICE_MAGNET_RETAIL: PRICE,
  PRICE_STICKER_RETAIL: PRICE,
  PRICE_CAP_RETAIL: PRICE,
  PRICE_TOTE_RETAIL: PRICE,
  PRICE_COASTER_RETAIL: PRICE,
  MARGIN_FLOOR_PCT: PCT,
  MARGIN_TOP_PCT: PCT,
  BOX_MAGNETS: INT,
  BOX_STICKERS: INT,
  BOX_COASTERS: INT,
  BOX_CAPS: INT,
  BOX_TOTES: INT,
  BOX_VALUE_RETAIL: INT,
  TRIAL_REPLY_DAYS: INT,
  TRIAL_SHIP_DAYS: INT,
  REORDER_DAYS: INT,
  TRIAL_REORDER_MIN: INT,
  CUSTOM_MIN: /^\$?\d+$/,
  CUSTOM_LEAD_DAYS: INT,
  TRIAL_ZIP_MIN: /^\d{5}$/,
  TRIAL_ZIP_MAX: /^\d{5}$/,
  GOATCOUNTER_CODE: /^[a-z0-9-]+$/,
};

// 32003 is the lowest Florida ZIP in use (Fleming Island), 34997 the highest.
const DEFAULTS = { TRIAL_REPLY_DAYS: "2", TRIAL_ZIP_MIN: "32003", TRIAL_ZIP_MAX: "34997" };

// Default export only: with a second named export, Eleventy would hand templates
// the module object instead of these values.
export default () => {
  const env = process.env;
  const out = {};
  for (const [key, shape] of Object.entries(SPEC)) {
    const value = String(env[key] ?? "").trim() || DEFAULTS[key] || "";
    if (value && shape && !shape.test(value)) {
      throw new Error(`[trial] ${key}="${value}" is not a valid value (see src/_data/trial.js)`);
    }
    out[key] = value;
  }
  if (Number(out.TRIAL_ZIP_MIN) > Number(out.TRIAL_ZIP_MAX)) {
    throw new Error("[trial] TRIAL_ZIP_MIN is greater than TRIAL_ZIP_MAX");
  }
  return out;
};
