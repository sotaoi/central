const gateLayout = async (state, component) => {
  false && console.info('acknowledging state:', state);
  typeof component !== 'string' && (component = '');
  return `
  <html lang="en">
    <head>
      <style>
      <meta charset="utf-8">

        body {
          color: #fff;
          overflow-y: scroll;
        }
        a:link {
          color: inherit;
          cursor: pointer;
          text-decoration: none;
        }
        a:visited {
          color: inherit;
          cursor: pointer;
          text-decoration: none;
        }
        a:hover {
          color: inherit;
          cursor: pointer;
          text-decoration: underline;
        }
        a:active {
          color: inherit;
          cursor: pointer;
          text-decoration: none;
        }
        button {
          cursor: pointer;
        }
      </style>
    </head>
    <body style="margin: 0; display: flex; justify-content: center; align-items: center;">
      <div style="display:
        flex; justify-content: center; flex-direction: column; align-items: center; width: 100%;
        min-height: calc(100vh - 80px);
        background-color: #333; margin: 20px; border-radius: 30px; padding: 30px; padding-top: 15px; padding-bottom: 15px;
      ">
        ${component}
      </div>
    </body>
  </html>
  `;
};

module.exports = { gateLayout };
