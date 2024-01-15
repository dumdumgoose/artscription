"use strict"

const Web3 = require('@artela/web3');
const fs = require('fs');

async function f() {
    console.log('start running demo');

    const web3 = new Web3('https://betanet-inner1.artela.network');

    const sk = fs.readFileSync('private.key', 'utf-8').trim();
    const account = web3.eth.accounts.privateKeyToAccount(sk.trim());
    web3.eth.accounts.wallet.add(account.privateKey);

    let gasPrice = await web3.eth.getGasPrice();
    let chainId = await web3.eth.getChainId();
    let nonce = await web3.eth.getTransactionCount(account.address);
    const deployScript = 'data:,{"p":"art-20","op": "deploy","tick": "wave1","max": "21000000","lim": "1000"}'
    const mintScript = 'data:,{"p": "art-20","op": "mint","tick": "wave1","amt": "1000"}'

    let tx = {
        from: account.address,
        to: account.address,
        nonce: nonce++,
        gasPrice,
        gas: 4000000,
        data: "0x" + stringToHex(deployScript),
        chainId
    }

    let signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    console.log("deploy tx: \n", signedTx);

    let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("deploy tx receipt: \n", receipt);

    tx = {
        from: account.address,
        to: account.address,
        nonce: nonce++,
        gasPrice,
        gas: 4000000,
        data: "0x" + stringToHex(mintScript),
        chainId
    }

    signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    console.log("mint tx: \n", signedTx);

    receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("mint tx receipt: \n", receipt);
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
