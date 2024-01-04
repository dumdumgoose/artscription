"use strict"

const Web3 = require('@artela/web3');

async function f() {
    console.log('start running demo');

    const web3 = new Web3('https://testnet-rpc1.artela.network');

    const sk = "0x02f92574aecb8203041f9a6b7a392102af37d26cda5e1a1765ad4f27f7df0012";
    const account = web3.eth.accounts.privateKeyToAccount(sk.trim());
    web3.eth.accounts.wallet.add(account.privateKey);

    let gasPrice = await web3.eth.getGasPrice();
    let chainId = await web3.eth.getChainId();
    let nonce = await web3.eth.getTransactionCount(account.address);
    const deployScript = 'data:,{"p":"art-20","op": "deploy","tick": "arts","max": "21000000","lim": "1000"}'
    const mintScript = 'data:,{"p": "art-20","op": "mint","tick": "arts","amt": "1000"}'

    let mintCount = 1000;
    while (mintCount > 0) {
        let tx = {
            from: account.address,
            to: getRandomAddress(),
            nonce: nonce++,
            gasPrice,
            gas: 4000000,
            data: "0x" + stringToHex(mintScript),
            chainId
        }

        let signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        console.log("mint tx: \n", tx);

        let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("mint tx receipt: \n", receipt);
        
        // web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        await sleep(20);
    }
}

function getRandomAddress() {
    let addresses = ["0x125082679c302d0a23f8d24f289ea29b03108191",
        "0x225082679c302d0a23f8d24f289ea29b03108192",
        "0x325082679c302d0a23f8d24f289ea29b03108193",
        "0x425082679c302d0a23f8d24f289ea29b03108194",
        "0x525082679c302d0a23f8d24f289ea29b03108195",
        "0x625082679c302d0a23f8d24f289ea29b03108196",
        "0x725082679c302d0a23f8d24f289ea29b03108197",
        "0x825082679c302d0a23f8d24f289ea29b03108198",
        "0x925082679c302d0a23f8d24f289ea29b03108199",
        "0x025082679c302d0a23f8d24f289ea29b03108190"
    ];

    let random = Math.floor(Math.random() * 10);
    return addresses[random];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stringToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        var byte = str.charCodeAt(i).toString(16);
        hex += ('00' + byte).slice(-2);
    }
    return hex;
}

f().then()