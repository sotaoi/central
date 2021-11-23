const fs = require('fs');
const { config } = require('@sotaoi/central/lib/config');

const uuidv4 = () => {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const checkNonEmptyStrings = (items) => {
  if (!items || !(items instanceof Array) || !items.length) {
    return false;
  }
  let ok = true;
  for (item of items) {
    if (typeof item !== 'string' || !item) {
      ok = false;
      break;
    }
  }
  return ok;
};

const verifyGenericIntegrity = async () => {
  !fs.existsSync(config.keysPath) && fs.writeFileSync(config.keysPath, config.defaultKeys);
};

const checkSupercredentialsAreSet = async () => {
  await verifyGenericIntegrity();
  const keys = await getKeys();
  return typeof keys.supercredentials !== 'undefined';
};

const setSupercredentials = async (username, password) => {
  await verifyGenericIntegrity();
  if (await checkSupercredentialsAreSet()) {
    return;
  }
  const keys = await getKeys();
  keys.supercredentials = { username, password };
  fs.writeFileSync(config.keysPath, JSON.stringify(keys, null, 2));
};

const getDefaultClientObject = async (clientId, clientName) => {
  if (!checkNonEmptyStrings([clientId, clientName])) {
    throw new Error('Something went wrong getting a default client object');
  }
  return {
    'env.json': {
      APP_URL: 'https://app.url',
    },
    'secrets.json': {
      APP_SECRET: 'secret',
    },
  };
};

const getKeys = async () => {
  return JSON.parse(fs.readFileSync(config.keysPath).toString());
};

const verifySupercredentials = async (superusername, superpassword) => {
  try {
    if (!checkNonEmptyStrings([superusername, superpassword])) {
      return false;
    }
    const keys = await getKeys();
    const supercredentials = keys.supercredentials || null;
    if (
      supercredentials &&
      supercredentials.username === superusername &&
      supercredentials.password === superpassword
    ) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const verifyClientCredentials = async (clientName, clientId, clientSecret) => {
  try {
    if (!checkNonEmptyStrings([clientName, clientId, clientSecret])) {
      return false;
    }
    const keys = await getKeys();
    const client = keys.clients[clientName] || null;
    if (client && client.client_id === clientId && client.client_secret === clientSecret) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const clientExists = async (clientName) => {
  if (!checkNonEmptyStrings([clientName])) {
    throw new Error('Something went wrong, bad client name');
  }
  await verifyGenericIntegrity();
  const keys = await getKeys();
  return Object.keys(keys.clients).indexOf(clientName) !== -1;
};

const safeGetClient = async (clientName, clientId, clientSecret) => {
  try {
    if (!checkNonEmptyStrings([clientName, clientId, clientSecret])) {
      console.warn('Bad args, trying to safely get client');
      return null;
    }
    const keys = await getKeys();
    if (
      !(await clientExists(clientName)) ||
      keys.clients[clientName].client_id !== clientId ||
      keys.clients[clientName].client_secret !== clientSecret
    ) {
      console.warn('Client does not exist, or bad credentials, when trying to safely get client');
      return null;
    }
    return JSON.parse(JSON.stringify(keys.clients[clientName].client));
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getClient = async (clientName) => {
  try {
    const keys = await getKeys();
    if (!(await clientExists(clientName))) {
      console.warn('Client does not exist, or bad credentials, when trying to safely get client');
      return null;
    }
    return JSON.parse(JSON.stringify(keys.clients[clientName].client));
  } catch (err) {
    console.error(err);
    return null;
  }
};

const trim = (item, trimmable = []) => {
  if ((typeof item !== 'string' && typeof item !== 'number') || !(trimmable instanceof Array)) {
    return item;
  }
  typeof item === 'number' && (item = item.toString());
  if (!item.length) {
    return item;
  }
  trimmable.indexOf(' ') === -1 && trimmable.push(' ');
  trimmable.map((trimItem) => {
    while (item[0] === trimItem) {
      item = item.substr(1);
    }
    while (item[item.length - 1] === trimItem) {
      item = item.substr(0, item.length - 1);
    }
  });
  return item;
};

module.exports = {
  uuidv4,
  checkNonEmptyStrings,
  verifyGenericIntegrity,
  checkSupercredentialsAreSet,
  setSupercredentials,
  getDefaultClientObject,
  getKeys,
  verifySupercredentials,
  verifyClientCredentials,
  clientExists,
  safeGetClient,
  getClient,
  trim,
};
