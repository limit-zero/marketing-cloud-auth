class AuthToken {
  /**
   *
   * @param {object} params
   * @param {string} params.value The access token value.
   * @param {number} params.expiresIn The number of seconds until the token expires.
   */
  constructor({ value, expiresIn } = {}) {
    this.value = value;
    this.expiresIn = expiresIn;
  }

  /**
   * Determines if the token is valid.
   *
   * @returns {boolean}
   */
  isValid() {
    if (this.hasExpired()) return false;
    if (this.value) return true;
    return false;
  }

  /**
   * Determines if the token has expired.
   *
   * @returns {boolean}
   */
  hasExpired() {
    if (!this.value) return false;
    if (this.expiresIn && this.expiresIn <= process.hrtime()[0]) return true;
    return false;
  }

  /**
   * Converts this class to the string value of the token.
   *
   * @returns {string}
   */
  toString() {
    if (!this.value) return '';
    return this.value;
  }
}

module.exports = AuthToken;
