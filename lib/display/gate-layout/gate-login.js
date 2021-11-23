const { permissionDeniedScreen } = require('@sotaoi/central/lib/display/screens/permission-denied-screen');

const gateLogin = async (state) => {
  const authRecord = state.getState('app:auth_record');

  if (authRecord) {
    return permissionDeniedScreen(state);
  }

  return `
    <script>
      const gateLoginAction = ${(() => {
        try {
          const formData = new FormData();
          formData.append('username', document.querySelector('[name="username"]').value);
          formData.append('password', document.querySelector('[name="password"]').value);
          fetch('/api/auth', {
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
    <div style="margin: 15px; padding: 10px; background-color: #666; border-radius: 10px;">
      <form onSubmit="gateLoginAction(); return false;" method="POST" action="/api/auth">
        <input type="text" autocapitalize="off" name="username" value="" placeholder="Username" />
        <input type="password" name="password" value="" placeholder="Password" />
        <input type="submit" value="LOGIN" />
      </form>
    </div>
  `;
};

module.exports = { gateLogin };
