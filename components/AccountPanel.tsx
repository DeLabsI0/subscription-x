import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import styles from '../styles/Portal.module.css';
import Image from "next/image";
import { formatUnits, formatEther } from '@ethersproject/units';

const SuperfluidSDK = require("@superfluid-finance/js-sdk");

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

export const AccountPanel = () => {
  const { account, chainId, library, active, error, deactivate } = useWeb3React();
  const [daiBalance,setDaiBalance] = useState('');
  const [daiXBalance,setDaiXBalance] = useState('');
  const [daiSymbol, setDaiSymbol] = useState('');
  const [daiXSymbol, setDaiXSymbol] = useState('');

  const erc20_05 = new ethers.Contract(process.env.GOERLI_FDAI, abi, library);
  const erc20_MUMBAI = new ethers.Contract(process.env.MUMBAI_FDAI, abi, library);
  const erc20_MUMBAI_x = new ethers.Contract(process.env.MUMBAI_FDAIX, abi, library);


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
    return { daiBal, daiXBal }
  }

  useEffect(():any=>{
    if (active && (chainId === 80001)){
      getSymbol().then(({ daiSymbol, daiXSymbol})=>{
        setDaiSymbol(daiSymbol);
        setDaiXSymbol(daiXSymbol);
      });
      getBalance().then(({ daiBal, daiXBal })=>{
        setDaiBalance(formatEther(daiBal));
        setDaiXBalance(formatEther(daiXBal));
      })
    }
  },[chainId, account, library, daiBalance, daiSymbol, daiBalance]);

  
  
  return(
    <>
      {chainId === 5 && <div style={{
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
      <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexGrow: 2, height: 'cover', textAlign:'center'}}>
        <div className={styles.daiBalance}>
          <img src="./dai.png" className={styles.daiPic} />
          : {daiBalance}
          
        </div>
        <div className={styles.daiBalance} style={{borderLeft: 'solid 2px black'}}>
          <img src="./daix.png" className={styles.daiPic} />
          : {daiXBalance}
        </div>
        <p className={styles.symbolBox}>{`Token : ${daiSymbol}`}</p>
        <p className={styles.symbolBox}>{`Token : ${daiXSymbol}`}</p>
      </div>    
        <h4 style={{alignSelf: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Super Tokens allow you to stream using SuperFluid protocol.</h4> 
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
        )}</div>
        )}  
      
    </>
  )
}