const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'デッキの変更/確認(dk)',
      usage: '[name:string]',
      runIn: ['text', 'group'],
      aliases: ['dk'],
      extendedHelp: 'consumer : 製品版全部のせ\nchampionship : 大会デッキ',
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [name]) {
    const res = this.game.changeDeck(message, name);
    if (res) {
      return message.sendMessage(`現在のデッキは ${res} です`);
    }
    if (res === false) {
      return message.sendMessage('デッキが存在しません');
    }
    return message.sendMessage('部屋が作成されていません。');
  }
};
