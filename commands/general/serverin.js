const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '入っているサーバを表示',
    });
    this.data = this.client.providers.get('datas');
  }

  /**
   * @param {*} message
   */
  async run(message, [name]) {
    return message.sendMessage(this.client.guilds.cache.map((a)=>a.name).join(','));
  }
};
