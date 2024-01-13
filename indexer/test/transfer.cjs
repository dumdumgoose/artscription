"use strict"

const Web3 = require('@artela/web3');
const fs = require('fs');
const { randomInt } = require('node:crypto');
const web3 = new Web3('https://betanet-inner1.artela.network');

function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const byte = str.charCodeAt(i).toString(16);
        hex += ('00' + byte).slice(-2);
    }
    return hex;
}

async function main() {
    console.log('start running demo');

    const accounts = [];
    for (let i = 0; i < 1000; i++) {
        const newAccount = web3.eth.accounts.create();
        accounts.push(newAccount);
    }

    const privateKey = fs.readFileSync('private.key', 'utf-8').trim();

    const mainAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(mainAccount.privateKey);

    let gasPrice = await web3.eth.getGasPrice();
    let chainId = await web3.eth.getChainId();

    for (const account of accounts) {
        const rechargeTx = {
            from: mainAccount.address,
            to: account.address,
            value: web3.utils.toWei("0.1", "ether"),
            gasPrice,
            gas: 21000,
            chainId
        };
        const signedRechargeTx = await web3.eth.accounts.signTransaction(rechargeTx, mainAccount.privateKey);
        await web3.eth.sendSignedTransaction(signedRechargeTx.rawTransaction);
        console.log(`recharged 0.1 art to ${account.address}`);
        await mintInscription(account, gasPrice, chainId);
        transferInscription(account, accounts[randomInt(0, 1000)].address, gasPrice, chainId);
    }
}

async function mintInscription(account, gasPrice, chainId) {
    let nonce = await web3.eth.getTransactionCount(account.address);
    const mintScript = 'data:,{"p": "art-20","op": "mint","tick": "wave1","amt": "1000"}'
    let tx = {
        from: account.address,
        to: account.address,
        value: 0,
        nonce: nonce++,
        gasPrice,
        gas: 4000000,
        data: "0x" + stringToHex(mintScript),
        chainId
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`minted inscription WAVE1 for ${account.address}`);
}

async function transferInscription(account, to, gasPrice, chainId) {
    let nonce = await web3.eth.getTransactionCount(account.address);
    const mintScript = 'data:,{"p": "art-20","op": "transfer","tick": "wave1","amt": "1"}'

    for (let i = 0; i < 1000; i++) {
        let tx = {
            from: account.address,
            to: to,
            value: 0,
            nonce: nonce++,
            gasPrice,
            gas: 4000000,
            data: "0x" + stringToHex(mintScript),
            chainId
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`transferred inscription WAVE1 to ${to}`);
    }
}

main().then(console.log).catch(console.error);
