const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ファイルを受け付ける',
    });
  }

  /**
   * @param {*} message
   */
  async run(message) {
    console.log(message);
    if (msg.attachments) {
      for (const key in msg.attachments) {
        if (Object.prototype.hasOwnProperty.call(msg.attachments, key)) {
          const attachment = msg.attachments[key];
          download(attachment.url);
        }
      }
    }
    return message.sendMessage(`${message}`);
  }
};
