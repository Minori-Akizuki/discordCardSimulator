const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ゲームにエントリー(et)',
      usage: '[name:string]',
      runIn: ['text', 'group'],
      aliases: ['et'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [playerName]) {
    const name = playerName ? playerName : message.author.username;
    const res = this.game.entryRoom(message, name);
    if (res) {
      return message.sendMessage(`${name}(${message.author})の参加をうけつけました`);
    }
    if (res === false) {
      return message.sendMessage('すでにエントリーしています。');
    }
    return message.sendMessage('部屋が作成されていません。');
  }
};
