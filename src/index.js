const fetch = require('node-fetch');
const AuthToken = require('./token');

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
    if ((this.token && this.token.hasExpired()) || force) {
      this.fetchPromise = this.fetch(fetchOptions);
    }
    if (!this.fetchPromise) {
      this.fetchPromise = this.fetch(fetchOptions);
    }
    try {
      const { accessToken, expiresIn, retrievedAt } = await this.fetchPromise;
      this.token = new AuthToken({ value: accessToken, expiresIn, retrievedAt });
      return this.token;
    } catch (e) {
      this.fetchPromise = undefined;
      throw e;
    }
  }

  /**
   * Executes an authentication fetch request to Marketing Cloud.
   *
   * @private
   * @param {object} options Additional options to send to `fetch`.
   * @returns {Promise<string>} The Marketing Cloud access token.
   */
  async fetch(options = {}) {
    const { clientId, clientSecret } = this;
    // Set the retrievedAt before the request so the expiration will be slightly padded.
    const retrievedAt = new Date();
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
    return { accessToken, expiresIn, retrievedAt };
  }
}

module.exports = MarketingCloudAuth;
