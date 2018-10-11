class AuthToken {
  /**
   *
   * @param {object} params
   * @param {string} params.token The access token value.
   * @param {number} params.expiresIn The number of seconds until the token expires.
   */
  constructor({ token, expiresIn } = {}) {
    this.token = token;
    this.expiresIn = expiresIn;
  }

  /**
   * Determines if the token is valid.
   *
   * @returns {boolean}
   */
  isValid() {
    if (this.hasExpired()) return false;
    if (this.token) return true;
    return false;
  }

  /**
   * Determines if the token has expired.
   *
   * @returns {boolean}
   */
  hasExpired() {
    if (!this.token) return false;
    if (this.expiresIn && this.expiresIn <= process.hrtime()[0]) return true;
    return false;
  }

  /**
   * Converts this class to the string value of the token.
   *
   * @returns {string}
   */
  toString() {
    if (!this.token) return '';
    return this.token;
  }
}

module.exports = AuthToken;
