/* Teros blockchain. */

import SHA256 from 'crypto-js/sha256.js';

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block{
  constructor(timestamp, transactions, previousHash = ""){
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    console.log("Mining block..");
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("block mined: " + this.hash);
  }
}

class BlockChain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  // first block in the blockchain
  createGenesisBlock(){
    return new Block(new Date(), [new Transaction('0000', '0000', 0)], "0000000000000000000000000000000000000000000000000000000000000000");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(new Date(), this.pendingTransactions, this.chain[this.chain.length - 1].hash);
    block.mineBlock(this.difficulty);
    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      if(this.chain[i].hash !== this.chain[i].calculateHash()){
        return false;
      }
      if(this.chain[i - 1].hash != this.chain[i].previousHash){
        return false;
      }
    }
    return true;
  }
}


let teros = new BlockChain();
teros.createTransaction(new Transaction('address1', 'address2', 100));
teros.createTransaction(new Transaction('address2', 'address1', 60));

teros.minePendingTransactions('address3');
console.log('Balance of address3 is: ', teros.getBalanceOfAddress('address3'));

teros.minePendingTransactions('address3');
console.log('Balance of address3 is: ', teros.getBalanceOfAddress('address3'));
console.log('Balance of address1 is: ', teros.getBalanceOfAddress('address1'));
console.log('Balance of address2 is: ', teros.getBalanceOfAddress('address2'));

//console.log(teros);