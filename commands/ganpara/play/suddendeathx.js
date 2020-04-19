const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '対象プレイヤーに[奪取X](sdx)',
      usage: '<X:number> <target:number>',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['sdx'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [number, target]) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    const targetP = game.playerFromNumber(target);
    const market = game.market;
    if (!targetP) message.sendMessage('不正なプレイヤー番号です');
    message.sendMessage(`${player.name}が${targetP.name}に[即死${number}]を行いました`);
    player.suddenDeathX(targetP, number, market);
    return;
  }
};
