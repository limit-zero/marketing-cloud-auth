const fetch = require('node-fetch');

class MarketingCloudAuth {
  /**
   * @see https://developer.salesforce.com/docs/atlas.en-us.mc-getting-started.meta/mc-getting-started/get-access-token.htm
   *
   * @param {object} options
   * @param {string} options.clientId The Marketing Cloud API ID
   * @param {string} options.clientSecret The Marketing Cloud API Scecret
   * @param {string} options.authUrl The Marketing Cloud auth URL (optional)
   */
  constructor({
    clientId,
    clientSecret,
    authUrl = 'https://auth.exacttargetapis.com/v1/requestToken',
  } = {}) {
    if (!clientId || !clientSecret) {
      throw new Error('The `clientId` and `clientSecret` options are required.');
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authUrl = authUrl;
  }

  /**
   * Retrieves an access token.
   * Will only make a request if the token is falsy, expired, or the method
   * forces the request.
   *
   * @param {object} options
   * @param {boolean} options.force Whether to force a new auth token request.
   * @param {?object} options.fetchOptions Additional options to send to `fetch`.
   */
  async retrieve({ force = false, fetchOptions } = {}) {
    if (!this.token || this.hasExpired() || force) {
      this.token = await this.request(fetchOptions);
    }
    return this.token;
  }

  /**
   * Invalidates the token.
   */
  invalidate() {
    this.token = undefined;
    return this;
  }

  /**
   * Determines if the authentication token has expired.
   * Considers a falsy token as expired.
   */
  hasExpired() {
    if (!this.token) return true;
    if (this.expiresIn && this.expiresIn <= process.hrtime()[0]) return true;
    return false;
  }

  /**
   * Executes an authentication request to Marketing Cloud.
   *
   * @private
   * @param {object} options Additional options to send to `fetch`.
   * @returns {Promise<string>} The Marketing Cloud access token.
   */
  async request(options = {}) {
    const { clientId, clientSecret } = this;
    const res = await fetch(this.authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret }),
      ...options,
    });

    const {
      errorcode,
      message,
      accessToken,
      expiresIn,
    } = await res.json();

    if (errorcode) {
      const e = new Error(message || 'An unknown, fatal error occured.');
      e.code = errorcode;
      throw e;
    }
    if (expiresIn) {
      this.expiresIn = process.hrtime()[0] + expiresIn;
    }
    return accessToken;
  }
}

module.exports = MarketingCloudAuth;
