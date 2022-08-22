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
    // HANDLE MERKLE TREE
    const { MerkleTree } = require('merkletreejs');
    const keccak256 = require('keccak256')
    let addresses = await ethers.getSigners();
    addresses = addresses.slice(3).map(x => x.address);
    console.log(addresses);
    const signerAddresses = [owner.address, addr1.address, addr2.address]
    for (i = 0; i < 1; i++) {
        addresses = addresses.concat(signerAddresses);
    }
    console.log(addresses.length)
    console.log(addresses)
    const leaves = addresses.map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
    const buf2hex = x => "0x" + x.toString('hex'); 
    const root = buf2hex(tree.getRoot());

    // UPLOAD ALLOWLIST
    await hardhatMyNFT.setMerkleRoot(root);
    await hardhatMyNFT.setAllowlist(addresses, { gasLimit: 300000000000 });

    // MINT
    const ownerProof = tree.getProof(keccak256(owner.address)).map(x => buf2hex(x.data));
    //const ownerLeaf = buf2hex(keccak256(owner.address));
    //console.log(ownerLeaf);
    await hardhatMyNFT.allowlistMint(ownerProof);
    expect(await hardhatMyNFT.ownerOf(1)).to.equal(owner.address);
    await hardhatMyNFT.connect(addr1).allowlistMint2();
    expect(await hardhatMyNFT.ownerOf(2)).to.equal(addr1.address);
  });
});
