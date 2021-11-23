const mainLayout = async (state, component) => {
  typeof component !== 'string' && (component = '');
  return `
  <html lang="en">
    <head>
      <meta charset="utf-8">

      <style>
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
        <div style="margin: 15px; padding 10px; text-align: center;">
          <h1>Welcome</h1>
          <div style="display: flex; flex-direction: row; justify-content: center;">
            <button style="margin: 15px;" onClick="logoutAction(); return false;">Logout</button>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: center;">
            ${Object.entries(state.getState('clients'))
              .map(
                ([clientName, client]) =>
                  `<a href="/central/edit/${encodeURIComponent(clientName)}" style="margin: 15px;">${clientName}</a>`
              )
              .join('')}
          </div>
        </div>
        ${component}
      </div>
      <script>
        const logoutAction = ${(() => {
          try {
            const formData = new FormData();
            fetch('/api/deauth', {
              method: 'post',
              body: formData,
            })
              .then((res) => res.json())
              .then((res) => {
                alert(res && res.msg ? res.msg : 'Success!');
                window.location.href = '/';
              })
              .catch((err) => {
                console.error(err);
                alert(err && err.message ? err.message : 'There was an error');
              });
          } catch (err) {
            console.error(err);
            alert(err && err.message ? err.message : 'There was an error');
          }
        }).toString()};
      </script>
    </body>
  </html>
  `;
};

module.exports = { mainLayout };
