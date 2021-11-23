const { Config } = require('@sotaoi/config');
const express = require('express');
const formData = require('express-form-data');
const os = require('os');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const rateLimit = require('express-rate-limit');
const path = require('path');

const middleware = async (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.resolve('./public')));
  app.use(cookieParser());

  app.use(
    formData.parse({
      uploadDir: os.tmpdir(),
      autoClean: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 2000, // limit each IP to 2000 requests per windowMs
    })
  );

  app.use(
    session({
      secret: Config.env('APP_SECRET'),
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60, httpOnly: true },
      store: new FileStore({
        path: path.resolve('./storage/sessions'),
      }),
      resave: false,
    })
  );

  //

  return app;
};

module.exports = { middleware };
