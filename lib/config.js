const path = require('path');

const config = {
  keysPath: path.resolve('keys.json'),
  storagePath: path.resolve('./storage'),
  defaultKeys: JSON.stringify(
    {
      clients: {
        'dummy-client': {
          client_id: 'his-client-id',
          client_secret: 'his-client-secret',
          key: 'my-security-key-has-to-be-32-len',
          client: {
            'env.json': {
              APP_URL: 'https://app.url',
            },
            'secrets.json': {
              APP_SECRET: 'secret',
            },
          },
        },
      },
    },
    null,
    2
  ),
};

module.exports = { config };
