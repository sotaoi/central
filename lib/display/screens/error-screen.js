const errorScreen = async (state) => {
  false && console.info('acknowledging state:', state);
  return `
    <div style="margin: 15px; padding: 10px; background-color: #666; border-radius: 10px;">
      <a href="/">There was an error, we are probably fixing it right now.</a>
    </div>
  `;
};

module.exports = { errorScreen };
