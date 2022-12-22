const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
    const timestamp = 2000;
    const lastHash = "dummy-lastHash";
    const hash = "dummy-hash";
    const data = "dummy-data";
    const nonce = 1;
    const difficulty = 2;
    const block = new Block({timestamp, data, hash, lastHash, nonce , difficulty});

    it("has a timestamp, hash, lastHash and data property" , () =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe("genesis()", ()=>{
        const genesisBlock = Block.genesis();
        console.log("genesis ", genesisBlock);
        it('returns a block instance', ()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it("is equal to genesis data", ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe("mineBlock()", ()=>{
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});
        
        it("returns a block data", ()=>{
            expect(minedBlock instanceof Block).toBe(true);
        }); 

        it("sets the 'lastHash' to be the 'hash' of the lastBlock", ()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it("sets the 'data' attr", ()=>{
            expect(minedBlock.data).toEqual(data);
        });

        it("sets the 'timestamp' attr", ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it("creates a SHA-256 'hash' based on the proper inputs", ()=>{
            expect(minedBlock.hash)
            .toEqual(cryptoHash(minedBlock.timestamp, minedBlock.data, minedBlock.lastHash, minedBlock.nonce, minedBlock.difficulty));
        });

        it("sets a `hash` that matches the difficulty criteria", ()=>{
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it("adjusts the difficulty", ()=>{
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe("adjustDifficulty()", () =>{
        it("raises the difficulty for a quickly mined block", () =>{
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 1
            })).toEqual(block.difficulty+1);
        });

        it("lowers the difficulty for a slowly mined block", () =>{
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 1
            })).toEqual(block.difficulty-1);
        });

        it("has a lower limit of 1", () =>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        })
    });
});