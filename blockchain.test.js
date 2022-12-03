const Blockchain = require('./blockchain');
const Block = require('./block');

describe("Blockchain", ()=>{
    let blockchain, newChain, originalChain;

    beforeEach(() =>{
        blockchain = new Blockchain();
    });

    it("contains a 'chain' Array instance", ()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it("starts with the genesis block", ()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block", ()=>{
        const data = "dummy data";
        blockchain.addBlock({data});
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });

    describe("isValidChain()", ()=>{

        describe("when the chain doesnt start with the genesis block", ()=>{
            it("returns flase", ()=>{
                blockchain.chain[0] = {data: "fake-data"};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("when the chain starts with the genesis block and has multiple blocks", ()=>{
            beforeEach(()=>{
                blockchain.addBlock({data: "123"});
                blockchain.addBlock({data: "124"});
                blockchain.addBlock({data: "125"});
            });

            describe("and the lastHash reference has been changed", ()=>{
                it("returns false", ()=>{
                    blockchain.chain[2].lastHash = "fake-hash";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains an invalid field", ()=>{
                it("returns false", ()=>{
                    blockchain.chain[2].data = "fake-data";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain does not contain any invalid blocks", ()=>{
                it("returns true", ()=>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe("replaceChain()", ()=>{
        let errorMock, logMock;
        beforeEach(() =>{
            newChain = new Blockchain();
            originalChain = blockchain.chain;
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe("when the chain is not longer", ()=>{
            it("does not replace the chain", ()=>{
                newChain.chain[0].data = "fake-data";
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });
        });
        describe("when the new chain is longer", ()=>{
            
            beforeEach(() =>{
                newChain.addBlock({data: "123"});
                newChain.addBlock({data: "124"});
                newChain.addBlock({data: "125"});
            });

            describe("and the chain is invalid", ()=>{
                it("does not replace the chain", ()=>{
                    newChain.chain[2].data = "fake-data";
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe("and the chain is valid", ()=>{
                it("replaces the chain", ()=>{
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    })
});