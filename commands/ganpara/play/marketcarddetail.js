const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'カードの詳細表示(md,mkt)',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['md', 'mkt'],
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
    const strs = [];
    game.market.cs.forEach((c, i) => {
      strs.push(`${i+1} : ${c.showDetail()}`);
    });
    return message.sendMessage(strs.join('\n'));
  }
};
