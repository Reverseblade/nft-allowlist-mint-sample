// contracts/MyNFT.sol
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract NFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bytes32 merkleRoot;

    constructor() ERC721("NFT", "NFT") {
        mintNFT();
    }

    function mintNFT() public {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _tokenIds.increment();
    }

    function allowlistMint(bytes32[] memory proof) public returns(bool){
        //require(keccak256(abi.encodePacked(msg.sender)) == leaf, "You are not in allowlist");
        require(isAllowlisted(proof, keccak256(abi.encodePacked(msg.sender))), "You are not in allowlist");
        mintNFT();
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function isAllowlisted(bytes32[] memory proof, bytes32 leaf) public returns(bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}
