const {Provider} = require('klasa');
const Ganpara = require('../ganpara/ganpara');
const deck = require('../ganpara/deck_consumer').consumer();

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
   * メッセージから入るべきルームを作成する。
   * @param {KlasaMessage} message
   * @return {String} ルームの識別子
   */
  returnRoomId(message) {
    const serverId = message.guild ? message.guild.id : null;
    const channelId = message.channel.id;
    return serverId + channelId + '';
  }

  /**
   * messageから部屋を返す
   * @param {*} message メッセージ
   * @return {*}
   */
  returnRoom(message) {
    return this.rooms[this.returnRoomId(message)];
  }
  /**
   * 部屋の作成
   * @param {KlasaMessage} message
   * @return {*} room
   */
  makeRoom(message) {
    const roomId = this.returnRoomId(message);
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = {};
      this.rooms[roomId].id = roomId;
      this.rooms[roomId].game = new Ganpara();
      this.rooms[roomId].entryies = [];
      this.rooms[roomId].channel = message.channel;
      this.rooms[roomId].isStarted = false;
    }
    return this.rooms[roomId];
  }

  /**
   * 部屋の状態を表示
   * @param {KlasaMessage} message メッセージ
   * @return {String} 部屋の状態
   */
  status(message) {
    const room = this.rooms[this.returnRoomId(message)];
    if (!room) {
      return 'ルームが作られていません';
    }
    const players = '参加者 : ' + room.entryies.map((p)=>p.name).join(', ');
    console.log(room.isStarted);
    const started = '状態 : ' + (room.isStarted ? 'ゲーム中' : '未開始');
    const gameStatus = room.game.toString();
    return [players, started, gameStatus].join('\n');
  }
  /**
   * 部屋への参加
   * @param {KlasaMessage} message メッセージ
   * @param {String} name 別名
   * @return {*} 部屋
   */
  entryRoom(message, name) {
    const author = message.author.id;
    const roomId = this.returnRoomId(message);
    const room = this.rooms[roomId];

    // 部屋が作成されていない場合
    if (!room) {
      return null;
    }

    // すでにエントリーしていた場合
    if (room.entryies.findIndex((p)=>p.id==author) != -1) {
      return false;
    }

    const p = {
      id: author,
      name: name,
      messenger: {
        send: function(text) {
          author.sendMessage(text);
        },
      },
    };

    room.entryies.push(p);

    return room;
  }

  /**
   * ゲームの開始
   * @param {KlasaMessage} message 
   */
  startGame(message) {
    const room = this.returnRoom(message);
    room.game.setup(
        room.entryies,
        deck.lifesIn,
        deck.lifesOpt,
        deck.startHands,
        deck.startMarket,
        deck.deck,
    );
  }
};
