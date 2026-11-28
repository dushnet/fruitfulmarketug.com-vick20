export const DEFAULT_COUNTRY_CODE = "+256";

export interface PhoneValidationResult {
  valid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Validates and normalizes an international phone number.
 * Enforces leading '+' country code (default +256 for Uganda).
 */
export function validateInternationalPhone(raw: string): PhoneValidationResult {
  const cleaned = raw.trim().replace(/[\s\-().]/g, "");

  if (!cleaned.startsWith("+")) {
    return {
      valid: false,
      normalized: cleaned,
      error:
        "Phone number must start with a country code (default +256, e.g. +256701234567).",
    };
  }

  if (!/^\+[1-9]\d+$/.test(cleaned)) {
    return {
      valid: false,
      normalized: cleaned,
      error:
        "Invalid phone format. Use '+' followed by country code and digits only (e.g. +256701234567).",
    };
  }

  // Specific check for Uganda (+256): must be +256 followed by 9 digits (no leading 0)
  if (cleaned.startsWith("+256")) {
    if (cleaned.startsWith("+2560")) {
      return {
        valid: false,
        normalized: cleaned,
        error:
          "For Uganda (+256), drop the leading 0 after +256 (e.g. +256701234567).",
      };
    }
    if (!/^\+256\d{9}$/.test(cleaned)) {
      return {
        valid: false,
        normalized: cleaned,
        error:
          "Uganda phone numbers must be +256 followed by 9 digits (e.g. +256701234567).",
      };
    }
    return { valid: true, normalized: cleaned };
  }

  // General international E.164 check (+[country][subscriber], 9 to 15 digits total after +)
  if (!/^\+[1-9]\d{8,14}$/.test(cleaned)) {
    return {
      valid: false,
      normalized: cleaned,
      error:
        "Please enter a valid international phone number starting with country code (e.g. +256701234567).",
    };
  }

  return { valid: true, normalized: cleaned };
}
