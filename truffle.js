// Allows us to use ES6 in our migrations and tests.
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

module.exports = {
  networks: {
    myBlockchain: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gas: 2000000,
    },
  },
};
