const hre = require("hardhat");

async function main() {

  const SuperSubX = await hre.ethers.getContractFactory("SuperSubX");
  const CONTRACT_ADDRESS = "0x0f1068A735B3be9b24A8846e33ed6ffcD9F226fD";
  const contract = SuperSubX.attach(CONTRACT_ADDRESS);
  
  const name = await contract.name();

  const symbol = await contract.symbol();

  console.log(name + ':' + symbol);
  
}

main().then(()=>process.exit(0)).catch(error=>{console.error(error);process.exit(1);});