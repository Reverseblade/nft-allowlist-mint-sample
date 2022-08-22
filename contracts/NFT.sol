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
    bool isPreSaleActive = false;
    bool isPublicSaleActive = false;
    mapping(address => bool) isAllowlistClaimed;
    mapping(address => bool) allowlist;

    constructor() ERC721("NFT", "NFT") {
        mintNFT();
    }

    function mintNFT() public {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _tokenIds.increment();
    }

    function allowlistMint(bytes32[] memory proof) public {
        //require(keccak256(abi.encodePacked(msg.sender)) == leaf, "You are not in allowlist");
        //require(isPresaleActive, "Presale has not been started");
        require(MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(msg.sender))), "You are not on the allowlist");
        require(isAllowlistClaimed[msg.sender] != true, "Allowlist calimed");
        mintNFT();
        isAllowlistClaimed[msg.sender] = true;
    }

    function allowlistMint2() public {
        //require(isPresaleActive, "Presale has not been started");
        require(allowlist[msg.sender] == true, "You are not on the allowlist");
        require(isAllowlistClaimed[msg.sender] != true, "Allowlist calimed");
        mintNFT();
        isAllowlistClaimed[msg.sender] = true;
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function setAllowlist(address[] calldata addresses) external onlyOwner {
        for(uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Cannot add the null address");
            allowlist[addresses[i]] = true;
        }
    }

    function isAllowlist(bytes32[] memory proof, bytes32 leaf) public returns(bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}
