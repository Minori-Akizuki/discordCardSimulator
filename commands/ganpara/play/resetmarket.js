const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '場のリセットを行う(rsm)',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['rsm'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    const game = this.game.returnRoom(message).game;
    game.playerFromId(message.author.id).resetMarket(game.market, game.deck);
    return;
  }
};
