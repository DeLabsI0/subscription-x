const { expect } = require("chai");

describe("SuperSubX", () => {
  it("should return the new token name and symbol", async () => {
    const SuperSubX = await ethers.getContractFactory("SuperSubX");
    const superSubX = await SuperSubX.deploy("SubscriptionX Access Token", "SubX", "0xEB796bdb90fFA0f28255275e16936D25d3418603", "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873", "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f", "0x664aE785E61d9A8ACa154b344Ad6aB4B333515Cf", "7716049382716");
    await superSubX.deployed();

    expect(await superSubX.name()).to.equal('SubscriptionX Access Token');

    expect(await superSubX.symbol()).to.equal("SubX");

  });
});
