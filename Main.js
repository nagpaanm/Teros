/* Teros blockchain. */

import SHA256 from 'crypto-js/sha256.js';

class Data{
  constructor(value = 0){
    this.value = value;
  }
}

class Block{
  constructor(index, timestamp, data, previousHash = ""){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class BlockChain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }

  // first block in the blockchain
  createGenesisBlock(){
    return new Block(0, new Date(), new Data(), "0000000000000000000000000000000000000000000000000000000000000000");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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
teros.addBlock(new Block(1, new Date(), new Data(1)));
console.log(JSON.stringify(teros, null, 4));
console.log("Is Teros valid?: " + teros.isChainValid());