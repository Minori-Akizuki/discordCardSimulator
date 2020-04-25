const {Provider} = require('klasa');
const Ganpara = require('../ganpara/ganpara');
const decks = require('../ganpara/deck');
const Randomizer = require('../cardbase/randomizer');

module.exports = class extends Provider {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    super(...args, {name: 'ganparaGame'});
    this.rooms = {};
    this.rnd = new Randomizer();
    this.message = {
      NO_MAKED_ROOM: '部屋が作られていません',
      NO_STARTED_GAME: 'ゲームがスタートしていません',
    };
  }

  /**
   * diceroll
   * @param {Number} n
   * @return {Number}
   */
  dice(n) {
    return this.rnd.dice(n);
  }

  /**
   * ゲームがその部屋で開始されているかどうかを調べる
   * @param {KlasaMessage} message
   * @return {Boolean} ゲームが開始しているかどうか
   */
  isStartedGame(message) {
    const room = this.returnRoom(message);
    return room && room.isStarted;
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
      const messengerGloval = {send: function(txt) {
        message.channel.sendMessage(txt);
      }};
      this.rooms[roomId] = {};
      this.rooms[roomId].id = roomId;
      this.rooms[roomId].messengerGloval = messengerGloval;
      this.rooms[roomId].game = new Ganpara(messengerGloval);
      this.rooms[roomId].entryies = [];
      this.rooms[roomId].channel = message.channel;
      this.rooms[roomId].isStarted = false;
    }
    return this.rooms[roomId];
  }

  /**
   * ルームを消去する
   * @param {KlarsaMessage} message
   */
  destroyRoom(message) {
    const roomId = this.returnRoomId(message);
    this.rooms[roomId] = null;
    return;
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
    const author = message.author;
    const roomId = this.returnRoomId(message);
    const room = this.rooms[roomId];

    // 部屋が作成されていない場合
    if (!room) {
      return null;
    }

    // すでにエントリーしていた場合
    if (room.entryies.findIndex((p)=>p.id==author.id) != -1) {
      return false;
    }

    const p = {
      id: author.id,
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
   * デッキ変更
   * @param {KlasaMessage} message
   * @param {String} deckName
   * @return {String} 現在のデッキ
   */
  changeDeck(message, deckName) {
    const room = this.returnRoom(message);
    if (!room) return null;
    if (!deckName) return room.game.deckName;
    if (!decks.isExistsDeck(deckName)) return false;
    room.game.deckName = deckName;
    return room.game.deckName;
  }

  /**
   * 今のデッキの内容をチェックする
   * @param {KlasaMessage} message
   */
  async checkDeck(message) {
    const room = this.returnRoom(message);
    if (!room) {
      message.sendMessage('部屋が作成されていません');
      return;
    }
    const deckName = room.game.deckName;
    const dkobj = await decks.customdeck(deckName);
    const deck = room.game.sepaleteDeck(dkobj);
    message.sendMessage(`Full Deck : ${dkobj.length}`);
    for (const d in deck ) {
      if (deck[d]) {
        const str = `${d} : \n`;
        message.sendMessage(str);
        let da = deck[d].toString().split('\n');
        while (da.length) {
          message.sendMessage(da.splice(0, 10).join('\n'));
        }
      }
    }
  }

  /**
   * ゲームの開始
   * @param {KlasaMessage} message
   */
  async startGame(message) {
    const room = this.returnRoom(message);
    const deckName = room.game.deckName;
    const deck = await decks.customdeck(deckName);
    room.game.setup(
        room.entryies,
        deck,
    );
    room.isStarted = true;
  }
};
