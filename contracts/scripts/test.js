const hre = require("hardhat");

async function main() {

  const SuperSubX = await hre.ethers.getContractFactory("SuperSubX");
  const CONTRACT_ADDRESS = "0x1c5362D4668A408d6018f5Db88FAbcD0c7704df1";
  const contract = SuperSubX.attach(CONTRACT_ADDRESS);
  
  const name = await contract.name();

  const symbol = await contract.symbol();

  console.log(name + ':' + symbol);
}

main().then(()=>process.exit(0)).catch(error=>{console.error(error);process.exit(1);});