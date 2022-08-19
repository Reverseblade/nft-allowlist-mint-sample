const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    myNFT = await ethers.getContractFactory("NFT");
    hardhatMyNFT = await myNFT.deploy();
});

describe("NFT Contract", function () {
  it("Deployment", async function() {
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(owner.address);
  });

  it("Mint", async function() {
    const newNFT = await hardhatMyNFT.connect(addr1).mintNFT();
    expect(await hardhatMyNFT.ownerOf(1)).to.equal(addr1.address);
  });

  it("Allowlist Mint", async function() {
    // handle merkle tree
    const { MerkleTree } = require('merkletreejs');
    const keccak256 = require('keccak256')

    const leaves = [owner.address, addr1.address].map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
    const buf2hex = x => "0x" + x.toString('hex'); 
    const root = buf2hex(tree.getRoot());
    //console.log(root);

    await hardhatMyNFT.setMerkleRoot(root);

    //const ownerLeaf = buf2hex(keccak256(owner.address));
    const ownerProof = tree.getProof(keccak256(owner.address)).map(x => buf2hex(x.data));
    //console.log(ownerProof);
    //console.log(ownerLeaf);

    // mint
    await hardhatMyNFT.allowlistMint(ownerProof);
    expect(await hardhatMyNFT.ownerOf(1)).to.equal(owner.address);
  });
});
