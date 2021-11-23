const centralEditClientScreen = async (state) => {
  const clientName = state.getState('req').params.client
    ? decodeURIComponent(state.getState('req').params.client)
    : null;
  const clientSpace = require('@sotaoi/central/keys.json').clients[clientName];
  return `
    <link href="/jsoneditor/dist/jsoneditor.min.css" rel="stylesheet" type="text/css">
    <button onClick="saveAndUploadCredentials(); return false;" type="button" style="margin: 15px;">SAVE & UPLOAD</button>
    <div style="margin: 15px; padding: 10px; background-color: #666; border-radius: 10px;">
      <div id="jsoneditor" style="width: 400px; height: 400px;"></div>
    </div>
    <script src="/jsoneditor/dist/jsoneditor.min.js"></script>
    <script>
      // create the editor
      const container = document.getElementById('jsoneditor');
      const options = {};
      const editor = new JSONEditor(container, options);

      // set json
      const initialJson = ${JSON.stringify(clientSpace.client)};
      editor.set(initialJson);

      // save and upload
      const saveAndUploadCredentials = () => {
        const jsonResult = editor.get();
        const clientJson = {};
        Object.keys(jsonResult).map((key) => {
          clientJson[key] = jsonResult[key];
        });
        
        const formData = new FormData();
        formData.append('clientName', '${clientName}');
        formData.append('client', JSON.stringify(clientJson));
        fetch('/api/central/save', {
          method: 'post',
          body: formData,
        })
        .then((res) => res.json())
        .then((res) => {
          alert(res && res.msg ? res.msg : 'Success!');
          // window.location.href = '/';
        })
        .catch((err) => {
          console.error(err);
          alert(err && err.message ? err.message : 'There was an error');
        });
      };
    </script>
  `;
};

module.exports = { centralEditClientScreen };
