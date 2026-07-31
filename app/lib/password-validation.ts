export const passwordChecks = {
  length: (value: string) => value.length >= 8,
  uppercase: (value: string) => /[A-Z]/.test(value),
  lowercase: (value: string) => /[a-z]/.test(value),
  number: (value: string) => /\d/.test(value),
};

export function isStrongPassword(value: string) {
  return Object.values(passwordChecks).every((check) => check(value));
}
