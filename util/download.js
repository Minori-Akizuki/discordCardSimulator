const fs = require('fs');
const http = require('http');
const FOLDER_NAME = '../external/';
const axios = require('axios');

module.exports = function() {
  return {

    /**
     * URL先のテキストをgetする
     * @param {String} url 参照URL
     * @return {String}
     */
    downloadTextFileFromURL: async function(url) {
      console.log('download txt file: ' + url);

      // URLからのダウンロード
      const returnStatus = await axios.get(url);
      return returnStatus.data;
    },

    /**
     * externalフォルダにURL先のファイルを保存する
     * @param {String} txt テキストファイル
     * @return {String} ファイルパス
     */
    saveTxtFile: function(txt) {
      // fileのセーブ
      const filename = new URL(url).pathname.split('/').pop();
      const filepah = FOLDER_NAME + filename;
      fs.writeFile(filepath, txt, (err, data) => {
        if (err) {
          console.log('file save Err');
          returnStatus = null;
        } else {
          console.log('file save: ' + filepah);
          returnStatus = filepath;
        }
      });
      return returnStatus;
    },

  };
};
