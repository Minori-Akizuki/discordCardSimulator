const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '挨拶を返す',
    });
  }

  /**
   * @param {*} message
   */
  async run(message, [name]) {
    // const hs = new ReactionHandler('hogehoge', (m)=>m.author==message.author, {prompt: 'waiting...'}, null, []);
    return message.sendMessage(`ここは${message.guild}です！`);
  }
};
