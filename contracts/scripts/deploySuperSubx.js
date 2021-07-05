// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SuperSubX = await hre.ethers.getContractFactory("SuperSubX");
  const superSubX = await SuperSubX.deploy("SubscriptionX Access Token", "SuBx", "0xEB796bdb90fFA0f28255275e16936D25d3418603", "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873", "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f", "0x664aE785E61d9A8ACa154b344Ad6aB4B333515Cf", "7716049382716");

  await superSubX.deployed();

  console.log("SuperSubX deployed to:", superSubX.address);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
