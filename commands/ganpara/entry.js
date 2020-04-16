const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ゲームにエントリー',
      usage: '<name:string>',
    });
  }

  /**
   * @param {*} message
   */
  async run(message, [str]) {
    return message.sendMessage(str);
  }
};
