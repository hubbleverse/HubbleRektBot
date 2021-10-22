const Web3 = require('web3');
const ethers =  require('ethers');
const keccak256 = require('keccak256');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://api.avax-test.network/ext/bc/C/ws'));

web3.eth.subscribe(
    'logs',
    {
        address: '0xfe2239288Ab37b8bCCFb4ebD156463fb14EFC1e9',
    },
    function(error,result){
        if(error)
            console.log(error);
    }
)

.on("connected",function(subscriptionId){
    console.log(subscriptionId);
})

.on("data",function(data){
    var transactionHash=data.transactionHash;
    web3.eth.getTransaction(transactionHash)
        .then(console.log);
});


