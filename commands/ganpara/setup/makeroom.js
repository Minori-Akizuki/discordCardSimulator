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
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['mkr'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    const serverId = message.guild ? message.guild.id : null;
    const serverName = message.guild;
    const channnelId = message.channel.id;
    const channnelName = message.channel;
    if (!serverName) {
      return message.sendMessage('DMから部屋は作れません');
    };

    const room = this.game.makeRoom(message);
    console.log(room);
    return message.sendMessage(`${serverName}(${serverId}), ${channnelName}(${channnelId}) で部屋を作りました`);
  }
};
