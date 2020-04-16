const {Provider} = require('klasa');
const Ganpara = require('../ganpara/ganpara');

module.exports = class extends Provider {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    super(...args, {name: 'ganparaGame'});
    this.rooms = {};
  }

  /**
   * 部屋の作成
   * @param {String} serverName サーバ名
   * @param {String} roomName 部屋名
   */
  makeRoom(serverName, roomName) {
    this.rooms[serverName+roomName] = {};
    this.rooms[serverName+roomName].game = new Ganpara();
  }
};
