const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ワンモアドローをする',
      usage: '',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['omd'],
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
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    const deck = game.deck;
    const market = game.market;
    player.oneMoreDraw(deck, market);
    return;
  }
};
