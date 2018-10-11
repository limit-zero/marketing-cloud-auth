# Salesforce Marketing Cloud (Fuel) Authentication

Authenticates and retrieves an access token for the Salesforce Marketing Cloud API. The token can be used for either the REST or SOAP API.

## Features
- Simple
- Lightweight
- Modern: utilizes ES6, Promises via `async/await`, and `node-fetch`

## Install
Install with [Yarn](https://yarnpkg.com)
```
yarn add marketing-cloud-auth
```

## Usage
To retrieve an access token, require the class and provide your API client ID and secret.
```js
// your-file.js
const MarketingCloudAuth = require('marketing-cloud-auth');

// Instantiate the `MarketingCloudAuth` class
const auth = new MarketingCloudAuth({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});

// Retrieve an access token using async/await...
const retrieve = async () => {
  const token = await auth.retrieve();
  console.log(token);
}
retrieve();

// Or directly with a promise...
auth.retrieve().then(token => console.log(token));
```

Subsequent calls to `auth.retrieve` will _not_ make additional HTTP requests unless the token has expired or you explicitally force a new call via `auth.retrieve({ force: true })`.

Once the token is retrieved, you can include it in your REST API calls:
```http
GET https://www.exacttargetapis.com/platform/v1/endpoints
Accept: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```
Or your SOAP calls
```xml
<soap:header>
  <fueloauth>YOUR_ACCESS_TOKEN</fueloauth>
</soap:header>
<!-- OR (depending on which Salesforce docs you trust...) -->
 <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Header>
    <h:fueloauth xmlns="http://exacttarget.com"
                 xmlns:h="http://exacttarget.com">
      YOUR_ACCESS_TOKEN
    </h:fueloauth>
  </s:Header>
  [...]
 </s:Envelope>
```
For more information, see
- https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/authenticate-soap-api.htm
- https://developer.salesforce.com/docs/atlas.en-us.mc-getting-started.meta/mc-getting-started/get-access-token.htm
