const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
    const timestamp = "dummy-timestamp";
    const lastHash = "dummy-lastHash";
    const hash = "dummy-hash";
    const data = "dummy-data";
    const block = new Block({timestamp, data, hash, lastHash});

    it("has a timestamp, hash, lastHash and data property" , () =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.lastHash).toEqual(lastHash);
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
            .toEqual(cryptoHash(minedBlock.timestamp, minedBlock.data, minedBlock.lastHash));
        });
    });
});