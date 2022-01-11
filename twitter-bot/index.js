require('dotenv').config()
const twit = require("./twit");
const { ethers } = require('ethers');
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");
const keccak256 = require('keccak256');
const provider = new ethers.providers.WebSocketProvider('wss://api.avax-test.network/ext/bc/C/ws')

var today = new Date();

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const ammMap = {
  '0x74583fEbc73B8cfEAD50107C49F868301699641E': 'ETH-PERP',
  '0xCF9541901625fd348eDe299309597cB36f4e4328': 'BTC-PERP',
  '0x352B0c6B3Ef762F4fA4C20CfecD14251236fD166': 'AVAX-PERP'
}
const idxMap = {
  '0': 'ETH',
  '1': 'BTC',
  '2': 'AVAX',
}

async function main() {
  console.log(time)
  console.log('Console : Script is running now.')
  const clearingHouseAbi = [
    "event PositionLiquidated(address indexed trader, address indexed amm, int256 size, uint256 quoteAsset, int256 realizedPnl)",
  ]
  const MarginAbi = [
    "event MarginAccountLiquidated(address indexed trader, uint indexed idx, uint seizeAmount, uint repayAmount)",
  ]
  const clearingHouse = new ethers.Contract('0xfe2239288Ab37b8bCCFb4ebD156463fb14EFC1e9', clearingHouseAbi, provider)
  clearingHouse.on('PositionLiquidated', (trader, amm, size, _, __, event) => {
    const Side = size.lt(0) ? 'LONG' : 'SHORT';
    console.log(trader, amm, size);
    size = ethers.utils.formatEther(size.abs());
    var tweet = {
      status: size + ' ' + ammMap[amm] + ' ' + Side + ' position has been liquidated on : \n https://cchain.explorer.avax-test.network/tx/' + event.transactionHash,
    }
    twit.post('statuses/update', tweet, tweeted);
    function tweeted(err, data, response) {
      if (err) {
        console.log(err);
      } else {
        console.log("Console : Tweet Successful !");
        console.log(time)
      }
    }
    // tweet that "${size} ${ammMap[amm]} ${Side} position has been liquidated"
    // e.g. 500 AVAX-PERP LONG position on @HubbleExchange has been liquidated! - provide tx link ${event.transactionHash}
  })
  const MarginLiq = new ethers.Contract('0x5977D567DD118D87062285a36a326A75dbdb3C6D', MarginAbi, provider)
  MarginLiq.on('MarginAccountLiquidated', (trader, idx, seizeAmount, _repayAmount) => {
    seizeAmount = ethers.utils.formatEther(seizeAmount.abs());
    idx = Math.floor(ethers.utils.formatEther(idx.abs()));
    if (seizeAmount > 0.0) {
      var accountLiquidateTweet = {
        status: seizeAmount + ' ' + idxMap[idx] + ' ' + ' has been seized from trader ' + trader,
      }

      twit.post('statuses/update', accountLiquidateTweet, accTweet);
      function accTweet(err, data, response) {
        if (err) {
          console.log(err);
        } else {
          console.log("Console : Tweet Successful !");
          console.log(time)
        }

      }
    }
    console.log(idx, seizeAmount);
    console.log('Analyze data ^')
  })
  }

main()