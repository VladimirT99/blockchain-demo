const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({lastBlock: this.chain[this.chain.length - 1], data: data});
        this.chain.push(newBlock);
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }
        for(let i = 1; i < chain.length; i++){
            const block = chain[i];
            const lastHash = chain[i-1].hash;
            if(block.lastHash !== lastHash)
                return false;
            if(block.hash !== cryptoHash(block.data, block.lastHash, block.timestamp))
                return false;
        }

        return true;
    }

    replaceChain(chain){
        if(chain.length <= this.chain.length){
            console.error("replaceChain() failed: The incoming chain must be longer than the original");
            return;
        }
        if(!Blockchain.isValidChain(chain)){
            console.error("replaceChain() failed: The incoming chain is not valid");
            return;
        }
        

        this.chain = chain;
    }
}

module.exports = Blockchain;