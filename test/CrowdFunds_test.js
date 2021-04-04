let crowdFundsTest = artifacts.require("./crowdfund.sol");
const BigNumber = require('bignumber.js');


contract("CrowdFund",function(accounts){

let contract;
let contractCreatore=accounts[0];
let beneficiary =accounts[1];

const ONE_ETH = new BigNumber(1000000000000000000);

const OnGoing=0;
const Failed = 1;
const Succedded = 2;
const PaidOut = 3;

//Create init for my contarct with test value
beforeEach(async function(){

     contract = await crowdFundsTest.new(
         "New funding",
         1,
         10,
         beneficiary,
         {
             from:contractCreatore,
             gas:2000000
         }
     );

});

//Test the initial contract 
it("Contract Created Success"),async function(){
    let comName = await contract.name.call()
    expect(comName).to.equal('New funding');


    let actualBenef = await contract.beneficiary.call()
    expect(actualBenef).to.equal(beneficiary);
    
    let targetAmount = await contract.targetAmount.call()
    expect(ONE_ETH.isEqualTo(targetAmount)).to.equal(true);

    let state = await contract.state.call()
    expect(state.valueOf().toNumber()).to.equal(OnGoing);

}

//Test The contribute Function

it('Funds are Contributed', async function() {
    await contract.contribute({value: ONE_ETH, from: contractCreatore});

    let contributed = await contract.amounts.call(contractCreatore);
    expect(ONE_ETH.isEqualTo(contributed)).to.equal(true);

    let totalCollected = await contract.totalCollected.call();
    expect(ONE_ETH.isEqualTo(totalCollected)).to.equal(true);
});


});
