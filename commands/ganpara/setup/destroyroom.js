const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '部屋を削除',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['dstrr'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    console.log('room destroy');
    this.game.destroyRoom(message);
    return message.sendMessage(`部屋を消去しました。`);
  }
};
