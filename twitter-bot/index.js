require("dotenv").config();
const twit = require("./twit");
const { ethers } = require('ethers');
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");
const keccak256 = require('keccak256');
const provider = new ethers.providers.WebSocketProvider('wss://api.avax-test.network/ext/bc/C/ws')

const ammMap = {
    '0x74583fEbc73B8cfEAD50107C49F868301699641E': 'ETH-PERP',
    '0xCF9541901625fd348eDe299309597cB36f4e4328': 'BTC-PERP',
    '0x352B0c6B3Ef762F4fA4C20CfecD14251236fD166': 'AVAX-PERP'
  }
  
  async function main() {
    const clearingHouseAbi = [
      "event PositionLiquidated(address indexed trader, address indexed amm, int256 size, uint256 quoteAsset, int256 realizedPnl)",
    ]
    const clearingHouse = new ethers.Contract('0xfe2239288Ab37b8bCCFb4ebD156463fb14EFC1e9', clearingHouseAbi, provider)
    clearingHouse.on('PositionLiquidated', (trader, amm, size, _, __, event) => {
        var tweet={
            status : '${size} ${ammMap[amm]} ${Side} position has been liquidated on @HubbleExchange : \n https://cchain.explorer.avax-test.network/tx/${event.transactionHash}'
        }
        console.log(event);
        twit.post('statuses/update',tweet,tweeted);
        function tweeted(err,data,response){
        if(err){
        console.log(err);
        }else{
        console.log("Console : Tweet Successful !");
        }
      }
      // tweet that "${size} ${ammMap[amm]} ${Side} position has been liquidated"
      // e.g. 500 AVAX-PERP LONG position on @HubbleExchange has been liquidated! - provide tx link ${event.transactionHash}
    })
  }

main()