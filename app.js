const {Client} = require('klasa');
const Seclet = require('./secret.js');

// Klasaのクライアントオプション: https://klasa.js.org/#/docs/klasa/master/typedef/KlasaClientOptions
new Client({
  prefix: '!!', // ボットのPrefix
}).login(Seclet.token); // ここにボットのトークン
