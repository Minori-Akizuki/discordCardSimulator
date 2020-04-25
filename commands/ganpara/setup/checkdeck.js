const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'デッキ内容の確認(cdk)',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['cdk'],
      extendedHelp: '選択されているデッキの内容を確認する。',
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    this.game.checkDeck(message);
  }
};
