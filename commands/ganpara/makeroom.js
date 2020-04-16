const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '部屋を作成',
      usage: '[roomName:string]',
    });
    // this.room = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {*} message
   */
  async run(message, [roomName]) {
    const serverName = message.guild;
    if (!serverName && !roomName) {
      return message.sendMessage('DMから部屋を作成する場合は roomname が必須です');
    }

    return message.sendMessage('部屋を作成しました(したとは言ってない)');
  }
};
