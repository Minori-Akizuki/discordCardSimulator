const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '手札を自分だけに表示(hd)',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['hd'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    const room = this.game.returnRoom(message);
    const own = room.game.playerFromId(message.author.id);
    return message.author.sendMessage(
        ['手札', own.hand.toString(), '前', own.front.toString()].join('\n'),
    );
  }
};
