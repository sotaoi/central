const helloScreen = async (state) => {
  false && console.info('acknowledging state:', state);
  return `
    <div style="margin: 15px; padding: 10px; background-color: #666; border-radius: 10px;">
      Hello!
    </div>
  `;
};

module.exports = { helloScreen };
