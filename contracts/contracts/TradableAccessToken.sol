// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;


/*************************** Tradable Access Token **************************\
 The following is a first draft implementation of a tradable access token. 
 The contract differentiates between the owner of the token, which cannot be 
 altered once minted, and the holder, who can freely transfer the token to any 
 non-0 address. The token may be recalled to the owned address without 
 approval from the holder. 
\****************************************************************************/


contract TradableAccessToken {

  // Token name
  string private _name;

  //Token Symbol
  string private _symbol;  

  //Mapping of tokenId to fixed owner
  mapping(bytes32 => address) private _owners;

  //Mapping of tokenId to current holder
  mapping(bytes32 => address) private _holders;

  //Mapping of balance to holder address
  mapping(address => uint256) private _balances;

  constructor (
      string memory name_,
      string memory symbol_
      ){
      _name = name_;
      _symbol = symbol_;
    }

  event Transfer(address indexed from, address indexed to, bytes32 indexed tokenID);

  function balanceOf(address holder) public view virtual returns (uint256) {
        require(holder != address(0), "ERC721: balance query for the zero address");
        return _balances[holder];
    }

  function ownerOf(bytes32 tokenId) public view virtual returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

  function holderOf(bytes32 tokenId) public view virtual returns (address) {
        address holder = _holders[tokenId];
        require(holder != address(0), "ERC721: holder query for nonexistent token");
        return holder;
    }

  function name() public view virtual returns (string memory) {
        return _name;
    }

  function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

  function tokenURI(bytes32 tokenId) public view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId)) : "";
    }
    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
  function _baseURI() internal view virtual returns (string memory) {
        return "Subscription X Access Token : ";
    }

  function _exists(bytes32 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

  function _isHolderOrOwner(address spender, bytes32 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = TradableAccessToken.ownerOf(tokenId);
        address holder = TradableAccessToken.holderOf(tokenId);
        return (spender == owner || spender == holder);
    }
  //Mint token, account for owner and holder independently
  function _mint(address to, bytes32 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;
        _holders[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

  //Burn Access Token
  function _burn(bytes32 tokenId) internal virtual {
        address holder = TradableAccessToken.holderOf(tokenId);

        _balances[holder] -= 1;
        delete _owners[tokenId];
        delete _holders[tokenId];

        emit Transfer(holder, address(0), tokenId);
    }

  // Transfer must be called by owner or holder of token, cannot transfer to 0 address
  function _transfer(
        address from,
        address to,
        bytes32 tokenId
    ) public virtual {
        require((TradableAccessToken.ownerOf(tokenId) == from) || (TradableAccessToken.holderOf(tokenId) == from), "Access Token: transfer of token that is not own");
        require(to != address(0), "Access Token: transfer to the zero address");

        _balances[from] -= 1;
        _balances[to] += 1;
        _holders[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

  // Recall Access Tokens to owners wallet
  function recall(
        address owner,
        bytes32 tokenId
    ) external virtual {
        require (TradableAccessToken.ownerOf(tokenId) == owner);
        address holder = _holders[tokenId];
        require(holder != owner);
        _transfer(holder, owner, tokenId);
    }
  
}
