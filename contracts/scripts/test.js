const hre = require("hardhat");

async function main() {

  const SuperSubX = await hre.ethers.getContractFactory("SuperSubX");
  const CONTRACT_ADDRESS = "0xF5a1bC6951AF7bC729321B5744a270F53096F627";
  const contract = SuperSubX.attach(CONTRACT_ADDRESS);
  
  const name = await contract.name();

  const symbol = await contract.symbol();

  console.log(name + ':' + symbol);
  
}

main().then(()=>process.exit(0)).catch(error=>{console.error(error);process.exit(1);});