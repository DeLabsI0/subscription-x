// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/***************************Tradable Access Token***************************\
   The following is a first draft implementation of a tradable access token. 
  The contract differentiates between the owner of the token, which cannot be 
 altered once minted, and the holder, who can freely transfer the token to any 
     non-0 address. The token may be recalled to the owned address without 
                          approval from the holder. 
\***************************************************************************/

interface TradableAccessToken {
  //Event emitted upon mint, transfer or burn
  event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);

  // Return name of access token as string
  function name() view external returns (string memory);
  
  // Return symbol of access token as string
  function symbol() view external returns (string memory);

  //Return token URI as string
  function tokenURI(uint256 tokenId) view external returns (string memory);

  //Return balance of holders account
  function balanceOf(address holder) view external returns (uint256);

  //Return owner address of tokenId 
  function ownerOf(uint256 tokenId) view external returns (address);
  
  //Return holder address of tokenId
  function holderOf(uint256 tokenId) view external returns (address);

  //Transfer tokenId and balance from one holder to another
  function _transfer(address from, address to, uint256 tokenId) external;

}