import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import styles from '../styles/Portal.module.css';
import Image from "next/image";
import { formatUnits, formatEther } from '@ethersproject/units';

const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const _subXContractAddress = "0x1c5362D4668A408d6018f5Db88FAbcD0c7704df1";
const subXFlowRate = "7716049382716";


const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (boolean)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const abiSubx = [

    //Event emitted upon mint, transfer or burn
    "event Transfer(address indexed from, address indexed to, bytes32 indexed tokenID)",
  
    // Return name of access token as string
    "function name() view external returns (string memory)",
    
    // Return symbol of access token as string
    "function symbol() view external returns (string memory)",
  
    //Return token URI as string
    "function tokenURI(bytes32 tokenId) view external returns (string memory)",
  
    //Return balance of holders account
    "function balanceOf(address holder) view external returns (uint256)",
  
    //Return owner address of tokenId 
    "function ownerOf(bytes32 tokenId) view external returns (address)",
    
    //Return holder address of tokenId
    "function holderOf(bytes32 tokenId) view external returns (address)",
  
    //Transfer tokenId and balance from one holder to another
    "function _transfer(address from, address to, bytes32 tokenId) external"
];

export const AccountPanel = () => {
  const { account, chainId, library, active, error, deactivate } = useWeb3React();
  const [daiBalance,setDaiBalance] = useState('');
  const [daiXBalance,setDaiXBalance] = useState('');
  const [daiSymbol, setDaiSymbol] = useState('');
  const [daiXSymbol, setDaiXSymbol] = useState('');
  const [flowActive, setFlowActive] = useState(false);
  const [subXBalance, setSubXBalance] = useState(0);

  const erc20_05 = new ethers.Contract(process.env.GOERLI_FDAI, abi, library);
  const erc20_MUMBAI = new ethers.Contract(process.env.MUMBAI_FDAI, abi, library);
  const erc20_MUMBAI_x = new ethers.Contract(process.env.MUMBAI_FDAIX, abi, library);
  const subXContract = new ethers.Contract(_subXContractAddress, abiSubx, library);
  const sf = new SuperfluidSDK.Framework({
    ethers: library
    });

  const subscriber = sf.user({
    address: account,
    token: process.env.MUMBAI_FDAIX
    });


  const CURRENT_CONTRACT: { [chainId: number]: ethers.Contract } = {
    5: erc20_05 as ethers.Contract,
    80001: erc20_MUMBAI as ethers.Contract
    }

  const CHAIN_NAME: { [chainId: number]: string } = {
    5: 'Goerli Testnet' as string,
    80001: 'Polygon Testnet (Mumbai)' as string
    }

  async function getSymbol(contract?: any){
    let daiSymbol = await CURRENT_CONTRACT[chainId].symbol();
    let daiXSymbol = await erc20_MUMBAI_x.symbol();
    return {daiSymbol, daiXSymbol};
    }

  async function getBalance(){
    let daiBal = await CURRENT_CONTRACT[chainId].balanceOf(account);
    let daiXBal = await erc20_MUMBAI_x.balanceOf(account);
    let subXBal = await subXContract.balanceOf(account);
    return { daiBal, daiXBal, subXBal }
    }

  async function sfInitialize(){
    await sf.initialize();
    }

  async function startSubscriptionX() {
    await subscriber.flow({
      recipient: _subXContractAddress,
      flowRate: subXFlowRate
      });
    }

  async function getFlowActive() {
    let flowRate = (await sf.cfa.getFlow({superToken: process.env.MUMBAI_FDAIX, sender: account, receiver: _subXContractAddress})).toString();
    if (flowRate === '0'){
      setFlowActive(false);
      }
    else {
      setFlowActive(true);
      }
      console.log(`This is flow ${flowRate}`);
    }

  async function deleteSubscriptionX() {
    await sf.cfa.deleteFlow({superToken: process.env.MUMBAI_FDAIX, sender: account, receiver: _subXContractAddress, by: account});
    }

  useEffect(():any=>{
    if (active && (chainId === 80001)){
      getSymbol().then(({ daiSymbol, daiXSymbol})=>{
        setDaiSymbol(daiSymbol);
        setDaiXSymbol(daiXSymbol);
        });
      getBalance().then(({ daiBal, daiXBal, subXBal })=>{
        setDaiBalance(formatEther(daiBal));
        setDaiXBalance(formatEther(daiXBal));
        setSubXBalance(subXBal.toNumber());
        });
      sfInitialize().then(()=>{getFlowActive();});  
      }

  },[chainId, account, library, daiBalance, daiSymbol, daiBalance]);

  
  
  return(
    <>
      {chainId !== 80001 && <div style={{
                        display: 'grid',
                        gridTemplate: 'columns',
                        position: 'absolute', 
                        top: '0%', 
                        height: 'cover', 
                        fontSize: '1.8rem',
                        fontWeight: 'bold', 
                        alignContent: 'center', 
                        textAlign: 'center'}}>
                      <h2 style={{marginBottom: '0'}}>SubscriptionX</h2>
                      <hr style={{width:'80%', borderColor: 'black' }}/>
                          
                      You must be connected to the polygon network.
                        
                      <button
                        style={{
                        height: '2rem',
                        position: 'absolute',
                        bottom: '-3.5rem',
                        right: '50%',
                        transform: 'translate(50%)',
                        borderRadius: '6px',
                        border: 'solid 2px white',
                        backgroundColor: 'black',
                        color: 'white',
                        cursor: 'pointer',
              
                        }} onClick={(e) => {
                        e.preventDefault();
                        window.location.href='https://docs.matic.network/docs/develop/network-details/network/';}}>
                        <img style={{maxWidth: '65%', maxHeight: '65%', float: 'left', marginRight: '.3rem'}} src="./polygon.png" />
                        <span>Polygon Network</span></button></div>}
      
      {chainId === 80001 && (<div>
      <div style={{textAlign:'center'}}>
        <h2 style={{marginBottom:'0', paddingBottom:'0'}}>Account:  {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
        </h2>
        <h5 style={{marginTop: 0}}>{`Chain : ${CHAIN_NAME[chainId]}`}</h5>
      </div>
      {(flowActive === false) && (<div>
      <div style={{display: 'grid', gridTemplate: 'column', height: 'cover', textAlign:'center', alignContent: 'center', justifyContent: 'center'}}>
        
        <div className={styles.daiBalance}>
          <img src="./daix.png" className={styles.daiPic} />
          : {daiXBalance.substring(0,6)}
        </div>
        <p className={styles.symbolBox}>{`SYM: ${daiXSymbol}`}</p>
      </div></div>)}
    {(daiXBalance === '0.00') && (flowActive === false) && (<div>
        <h5 style={{width: '100%', fontWeight: 'bold', paddingLeft: '2rem', paddingRight: '2rem', marginTop: '1rem', textAlign:'center', alignContent: 'center', justifyContent: 'center'}}>You require more Super Tokens!!!</h5> 
        {(active || error) && (
          <button
            style={{
              height: '2rem',
              position: 'absolute',
              bottom: '1rem',
              right: '50%',
              transform: 'translate(50%)',
              borderRadius: '6px',
              border: 'solid 2px white',
              backgroundColor: 'black',
              color: 'white',
              cursor: 'pointer',
              
            }} onClick={(e) => {
              e.preventDefault();
              window.location.href='https://app.superfluid.finance/';
              }}>
            Get Super Tokens
          </button>
        )}</div>)}
    {(daiXBalance !== '0.00') && (flowActive === false) && (<div>
        <h5 style={{width: '100%', fontWeight: 'bold', paddingLeft: '2rem', paddingRight: '2rem', marginTop: '1rem', textAlign:'center', alignContent: 'center', justifyContent: 'center'}}>SubscriptionX: 20 fDAIx monthly rate</h5> 
        {(active || error) && (
          <button
            style={{
              height: '2rem',
              position: 'absolute',
              bottom: '1rem',
              right: '50%',
              transform: 'translate(50%)',
              borderRadius: '6px',
              border: 'solid 2px white',
              backgroundColor: 'black',
              color: 'white',
              cursor: 'pointer',
              
            }} onClick={startSubscriptionX}>
            Start SubscriptionX
          </button>
        )}</div>)}
        {(flowActive === true) && (<div style={{textAlign: 'center'}}>Token Remote: {subXBalance}
          <button
            style={{
              height: '2rem',
              position: 'absolute',
              bottom: '1rem',
              right: '50%',
              transform: 'translate(50%)',
              borderRadius: '6px',
              border: 'solid 2px white',
              backgroundColor: 'black',
              color: 'white',
              cursor: 'pointer',
              
            }} onClick={deleteSubscriptionX}>
            Cancel SubscriptionX
          </button>
        </div>)}
        
        
        </div>
        )}  
      
    </>
  )
}