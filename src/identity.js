/**
 * Builds the `user@host` prefix shown before the session path.
 *
 * Either half may be empty (for example when the OS cannot report a user);
 * the remaining half is still shown, and an empty prefix is returned when
 * neither is available.
 *
 * @param {string} [user]
 * @param {string} [host]
 * @returns {string}
 */
export function identityLabel(user, host) {
  return [user, host].filter(Boolean).join("@")
}
