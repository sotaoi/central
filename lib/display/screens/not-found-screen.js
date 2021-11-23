const notFoundScreen = async (state) => {
  false && console.info('acknowledging state:', state);
  return `
    <div style="margin: 15px; padding: 10px; background-color: #666; border-radius: 10px;">
      <a href="/">We did not find what you were looking for.</a>
    </div>
  `;
};

module.exports = { notFoundScreen };
