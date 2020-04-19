const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ダイスロール',
      usage: '<number:number>',
      runIn: ['text', 'group'],
      aliases: ['dr'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [n]) {
    const r = this.game.dice(n);
    return message.sendMessage(`1d${n} : ${r}`);
  }
};
