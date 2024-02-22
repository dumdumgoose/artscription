"use strict"

const Web3 = require('@artela/web3');
const fs = require('fs');
const helpers = require('web3-core-helpers');
const Common = require('@ethereumjs/common').default;
const { TransactionFactory } = require('@ethereumjs/tx');
const { utils } = require('web3');
const HardForks = require('@ethereumjs/common').Hardfork;

const isNot = function (value) {
  return (typeof value === 'undefined') || value === null;
};

const isExist = function (value) {
  return (typeof value !== 'undefined') && value !== null;
};

const getMsgHash = function getMsgHash(tx, web3, sender) {
  const transactionOptions = {},
    hasTxSigningOptions = !!(tx && ((tx.chain && tx.hardfork) || tx.common));

  if (!tx) {
    throw new Error('No transaction object given!');
  }

  if (isExist(tx.common) && isNot(tx.common.customChain)) {
    throw new Error('If tx.common is provided it must have tx.common.customChain');
  }

  if (isExist(tx.common) && isNot(tx.common.customChain.chainId)) {
    throw new Error('If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId');
  }

  if (isExist(tx.common) && isExist(tx.common.customChain.chainId) && isExist(tx.chainId) && tx.chainId !== tx.common.customChain.chainId) {
    throw new Error('Chain Id doesnt match in tx.chainId tx.common.customChain.chainId');
  }

  function getMsgHash(tx) {
    const error = _validateTransactionForSigning(tx);

    if (error) {
      throw error;
    }

    const transaction = helpers.formatters.inputCallFormatter(Object.assign({}, tx));
    transaction.data = transaction.data || '0x';
    transaction.value = transaction.value || '0x';
    transaction.gasLimit = transaction.gasLimit || transaction.gas;
    if (transaction.type === '0x1' && transaction.accessList === undefined) transaction.accessList = []

    // Because tx has no @ethereumjs/tx signing options we use fetched vals.
    if (!hasTxSigningOptions) {
      transactionOptions.common = Common.forCustomChain(
        'mainnet',
        {
          name: 'custom-network',
          networkId: transaction.networkId,
          chainId: transaction.chainId
        },
        transaction.hardfork || HardForks.London
      );

      delete transaction.networkId;
    } else {
      if (transaction.common) {
        transactionOptions.common = Common.forCustomChain(
          transaction.common.baseChain || 'mainnet',
          {
            name: transaction.common.customChain.name || 'custom-network',
            networkId: transaction.common.customChain.networkId,
            chainId: transaction.common.customChain.chainId
          },
          transaction.common.hardfork || HardForks.London,
        );

        delete transaction.common;
      }

      if (transaction.chain) {
        transactionOptions.chain = transaction.chain;
        delete transaction.chain;
      }

      if (transaction.hardfork) {
        transactionOptions.hardfork = transaction.hardfork;
        delete transaction.hardfork;
      }
    }

    const ethTx = TransactionFactory.fromTxData(transaction, transactionOptions);
    const msgHash = ethTx.getMessageToSign(true).toString('hex');
    if (msgHash.startsWith('00000')) {
      console.log(ethTx);
    }
    return msgHash;
  }

  tx.type = _handleTxType(tx);

  // Resolve immediately if nonce, chainId, price and signing options are provided
  if (
    tx.nonce !== undefined &&
    tx.chainId !== undefined &&
    (
      tx.gasPrice !== undefined ||
      (
        tx.maxFeePerGas !== undefined &&
        tx.maxPriorityFeePerGas !== undefined
      )
    ) &&
    hasTxSigningOptions
  ) {
    return getMsgHash(tx);
  }

  // Otherwise, get the missing info from the Ethereum Node
  return Promise.all([
    ((isNot(tx.common) || isNot(tx.common.customChain.chainId)) ? //tx.common.customChain.chainId is not optional inside tx.common if tx.common is provided
      (isNot(tx.chainId) ? web3.eth.getChainId() : tx.chainId)
      : undefined),
    isNot(tx.nonce) ? web3.eth.getTransactionCount(sender) : tx.nonce,
    isNot(hasTxSigningOptions) ? web3.eth.getNetworkId() : 1,
    _handleTxPricing(web3, tx)
  ]).then(function (args) {
    const [ txchainId, txnonce, txnetworkId, txgasInfo ] = args;

    if ((isNot(txchainId) && isNot(tx.common) && isNot(tx.common.customChain.chainId)) || isNot(txnonce) || isNot(txnetworkId) || isNot(txgasInfo)) {
      throw new Error('One of the values "chainId", "networkId", "gasPrice", or "nonce" couldn\'t be fetched: ' + JSON.stringify(args));
    }

    return getMsgHash({
      ...tx,
      ...((isNot(tx.common) || isNot(tx.common.customChain.chainId)) ? { chainId: txchainId } : {}), // if common.customChain.chainId is provided no need to add tx.chainId
      nonce: txnonce,
      networkId: txnetworkId,
      ...txgasInfo // Will either be gasPrice or maxFeePerGas and maxPriorityFeePerGas
    });
  });
};

function _validateTransactionForSigning(tx) {
  if (tx.common && (tx.chain && tx.hardfork)) {
    return new Error(
      'Please provide the @ethereumjs/common object or the chain and hardfork property but not all together.'
    );
  }

  if ((tx.chain && !tx.hardfork) || (tx.hardfork && !tx.chain)) {
    return new Error(
      'When specifying chain and hardfork, both values must be defined. ' +
      'Received "chain": ' + tx.chain + ', "hardfork": ' + tx.hardfork
    );
  }

  if (
    (!tx.gas && !tx.gasLimit) &&
    (!tx.maxPriorityFeePerGas && !tx.maxFeePerGas)
  ) {
    return new Error('"gas" is missing');
  }

  if (tx.gas && tx.gasPrice) {
    if (tx.gas < 0 || tx.gasPrice < 0) {
      return new Error('Gas or gasPrice is lower than 0');
    }
  } else {
    if (tx.maxPriorityFeePerGas < 0 || tx.maxFeePerGas < 0) {
      return new Error('maxPriorityFeePerGas or maxFeePerGas is lower than 0');
    }
  }

  if (tx.nonce < 0 || tx.chainId < 0) {
    return new Error('Nonce or chainId is lower than 0');
  }
}

function _handleTxType(tx) {
  // Taken from https://github.com/ethers-io/ethers.js/blob/2a7ce0e72a1e0c9469e10392b0329e75e341cf18/packages/abstract-signer/src.ts/index.ts#L215
  const hasEip1559 = (tx.maxFeePerGas !== undefined || tx.maxPriorityFeePerGas !== undefined);

  let txType;

  if (tx.type !== undefined) {
    txType = utils.toHex(tx.type)
  } else if (hasEip1559) {
    txType = '0x2'
  }

  if (tx.gasPrice !== undefined && (txType === '0x2' || hasEip1559))
    throw Error("eip-1559 transactions don't support gasPrice");
  if ((txType === '0x1' || txType === '0x0') && hasEip1559)
    throw Error("pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas");

  if (
    hasEip1559 ||
    (
      (tx.common && tx.common.hardfork && tx.common.hardfork.toLowerCase() === HardForks.London) ||
      (tx.hardfork && tx.hardfork.toLowerCase() === HardForks.London)
    )
  ) {
    txType = '0x2';
  } else if (
    tx.accessList ||
    (
      (tx.common && tx.common.hardfork && tx.common.hardfork.toLowerCase() === HardForks.Berlin) ||
      (tx.hardfork && tx.hardfork.toLowerCase() === HardForks.Berlin)
    )
  ) {
    txType = '0x1';
  }

  return txType
}

function _handleTxPricing(web3, tx) {
  return new Promise((resolve, reject) => {
    try {
      if (
        (tx.type === undefined || tx.type < '0x2')
        && tx.gasPrice !== undefined
      ) {
        // Legacy transaction, return provided gasPrice
        resolve({ gasPrice: tx.gasPrice })
      } else if (tx.type === '0x2' && tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
        // EIP-1559 transaction, return provided maxFeePerGas and maxPriorityFeePerGas
        resolve({ maxFeePerGas: tx.maxFeePerGas, maxPriorityFeePerGas: tx.maxPriorityFeePerGas })
      } else {
        Promise.all([
          web3.eth.getBlock('latest', false),
          web3.eth.getGasPrice()
        ]).then(responses => {
          const [ block, gasPrice ] = responses;
          if (
            (tx.type === '0x2') &&
            block && block.baseFeePerGas
          ) {
            // The network supports EIP-1559

            // Taken from https://github.com/ethers-io/ethers.js/blob/ba6854bdd5a912fe873d5da494cb5c62c190adde/packages/abstract-provider/src.ts/index.ts#L230
            let maxPriorityFeePerGas, maxFeePerGas;

            if (tx.gasPrice) {
              // Using legacy gasPrice property on an eip-1559 network,
              // so use gasPrice as both fee properties
              maxPriorityFeePerGas = tx.gasPrice;
              maxFeePerGas = tx.gasPrice;
              delete tx.gasPrice;
            } else {
              maxPriorityFeePerGas = tx.maxPriorityFeePerGas || '0x9502F900'; // 2.5 Gwei
              maxFeePerGas = tx.maxFeePerGas ||
                utils.toHex(
                  web3.utils.toBN(block.baseFeePerGas.toString(16))
                    .mul(web3.utils.toBN(2))
                    .add(web3.utils.toBN(maxPriorityFeePerGas))
                );
            }
            resolve({ maxFeePerGas, maxPriorityFeePerGas });
          } else {
            if (tx.maxPriorityFeePerGas || tx.maxFeePerGas)
              throw Error("Network doesn't support eip-1559")
            resolve({ gasPrice });
          }
        }).catch((error) => {
          reject(error);
        });
      }
    } catch (error) {
      reject(error)
    }
  })
}

async function f() {
  console.log('start running demo');

  const web3 = new Web3('http://127.0.0.1:8545');

  const sk = fs.readFileSync('private.key', 'utf-8').trim();
  const account = web3.eth.accounts.privateKeyToAccount(sk.trim());
  web3.eth.accounts.wallet.add(account.privateKey);

  let gasPrice = await web3.eth.getGasPrice();
  let chainId = await web3.eth.getChainId();
  let nonce = await web3.eth.getTransactionCount(account.address);
  const difficulty = 5;
  const deployScript = `data:,{"p":"art-20","op":"deploy","tick":"dummy","max":"21000000","lim":"1000","v":{"vms":["pow","airdrop"],"pow":{"difficulty":"${ difficulty }"}}}`

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

  // mint by pow
  const mintScript = 'data:,';

  let mintData = {
    "p": "art-20",
    "op": "mint",
    "tick": "dummy",
    "amt": "1000",
    "v": { "vm": "pow" }
  };

  tx = {
    from: account.address,
    to: account.address,
    nonce: nonce++,
    gasPrice,
    gas: 4000000,
    chainId
  }

  const startTime = Date.now();
  let powNonce = 0;
  while (true) {
    mintData.v.nonce = powNonce.toString(10);
    tx.data = "0x" + stringToHex(mintScript + JSON.stringify(mintData));
    // calculate tx hash
    let msgHash = await getMsgHash(tx, web3, account.address);
    console.log(`calculated msgHash: ${ msgHash }, difficulty: ${ difficulty }, powNonce: ${ powNonce }`)
    if (msgHash.startsWith("0".repeat(difficulty))) {
      break;
    }
    ++powNonce;
  }
  const endTime = Date.now();
  console.log(`nonce: ${ powNonce }, time spent: ${ (endTime - startTime) / 1000 }s`);

  signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
  console.log("pow mint tx: \n", signedTx);

  receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("pow mint tx receipt: \n", receipt);

  // mint by airdrop
  mintData.v.vm = "airdrop";
  mintData.v.n = Math.floor(Math.random().toString(10) * 1000).toString(10);

  const inscriptionSignData = [
    mintData.p,
    mintData.op,
    mintData.tick,
    mintData.amt,
    mintData.v.vm,
    mintData.v.n,
  ]

  tx.nonce = nonce++;

  const sig = web3.eth.accounts.sign(JSON.stringify(inscriptionSignData), account.privateKey);
  mintData.v.sig = sig.signature;

  tx.data = "0x" + stringToHex(mintScript + JSON.stringify(mintData));

  const signerAddr = web3.eth.accounts.recover(JSON.stringify(inscriptionSignData), sig.signature);
  console.log(`signerAddr: ${ signerAddr }, senderAddr: ${ account.address }`);

  signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
  console.log("airdrop mint tx: \n", signedTx);

  receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("airdrop mint tx receipt: \n", receipt);
}


function stringToHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i).toString(16);
    hex += ('00' + byte).slice(-2);
  }
  return hex;
}

f().then()
