const { Config } = require('@sotaoi/config');
const fs = require('fs');
const path = require('path');

class AppState {
  state = {};

  constructor(initialState) {
    if (typeof initialState !== 'object' || !initialState) {
      throw new Error('Initial state must be an object');
    }
    Object.entries(initialState).map(([key, value]) => (this.state[key] = value));
  }

  static initialState(req) {
    return {
      'app:auth_record': !!req.session.auth_record ? req.session.auth_record : null,
      config: Config,
      req: req,
      clients: JSON.parse(fs.readFileSync(path.resolve('./keys.json')).toString()).clients || {},
    };
  }

  getState(key) {
    typeof key === 'number' && (key = key.toString());
    if (typeof key !== 'string') {
      return null;
    }
    return typeof this.state[key] !== 'undefined' ? this.state[key] : null;
  }

  setState(key, state) {
    typeof key === 'number' && (key = key.toString());
    if (typeof key !== 'string') {
      return null;
    }
    typeof state === 'undefined' && (state = null);
    this.state[key] = state;
    return state;
  }
}

module.exports = { AppState };
