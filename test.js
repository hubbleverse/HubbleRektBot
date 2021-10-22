const Web3 = require('web3');
const ethers =  require('ethers');
const keccak256 = require('keccak256');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://api.avax-test.network/ext/bc/C/ws'));


web3.eth.getTransactionReceipt('0x09fa08b8c7608b919888717ed79eb685bad344c8ac5d50b1903440fa3102dfb5')
    .then(console.log);


