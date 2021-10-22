require("dotenv").config();
const twit = require("./twit");
const Web3 = require('web3');
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");
const keccak256 = require('keccak256');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://api.avax-test.network/ext/bc/C/ws'));
var tweetInitializer={
  status: `Hubble bot has been locally deployed. Expect nothing but chaos.`
          
}
web3.eth.subscribe(
  'logs',
  {
      address: '0xfe2239288Ab37b8bCCFb4ebD156463fb14EFC1e9',
      topics: ['0x' + keccak256('PositionLiquidated(address,address,int256,uint256,int256)').toString('hex')]
  },
  function(error,result){
      if(error)
          console.log(error);
  }
)
.on("connected",function(subscriptionId){
  console.log(subscriptionId);
  twit.post('statuses/update',tweetInitializer,tweeted);
function tweeted(err,data,response){
  if(err){
    console.log(err);
  }else{
    console.log("Console : Connection successful !");
  }
}
})

.on("data",function(data){
  let transactionHash=data.transactionHash;
  var tweet={
    status : 'You have been liquidated good sir ! : https://cchain.explorer.avax-test.network/tx/'+transactionHash,
  }
  twit.post('statuses/update',tweet,tweeted);
function tweeted(err,data,response){
  if(err){
    console.log(err);
  }else{
    console.log("Console : Tweet Successful !");
  }
}
}
  )
