import crypto from 'crypto';

class Blockchain {
    constructor() {
        this.chain = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesis = {
            index: 0,
            timestamp: new Date().toISOString(),
            certId: 'GENESIS',
            studentName: 'N/A',
            course: 'N/A',
            institution: 'N/A',
            year: 0,
            marks: 'N/A',
            previousHash: '0',
            hash: this.calculateHash(0, 'GENESIS', '0', new Date().toISOString())
        };
        this.chain.push(genesis);
    }

    calculateHash(index, certId, previousHash, timestamp) {
        return crypto.createHash('sha256').update(index + certId + previousHash + timestamp).digest('hex');
    }

    mineBlock(block) {
        // Simple Proof of Work: find a hash that starts with '00'
        let nonce = 0;
        let hash = this.calculateHash(block.index, block.certId, block.previousHash, block.timestamp + nonce);
        while (!hash.startsWith('00')) {
            nonce++;
            hash = this.calculateHash(block.index, block.certId, block.previousHash, block.timestamp + nonce);
        }
        block.nonce = nonce;
        block.hash = hash;
        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addCertificateBlock(certData) {
        const previousBlock = this.getLatestBlock();
        const timestamp = new Date().toISOString();
        let newBlock = {
            index: previousBlock.index + 1,
            timestamp,
            certId: certData.certId,
            studentName: certData.studentName,
            course: certData.course,
            institution: certData.institution,
            year: certData.year,
            marks: certData.marks,
            previousHash: previousBlock.hash
        };
        
        newBlock = this.mineBlock(newBlock);
        this.chain.push(newBlock);
        return newBlock;
    }

    verifyCertificateOnChain(certId) {
        const block = this.chain.find(b => b.certId === certId);
        if (block) {
            return { verified: true, block };
        }
        return { verified: false };
    }

    getChain() {
        return this.chain;
    }
}

export const blockchainService = new Blockchain();
