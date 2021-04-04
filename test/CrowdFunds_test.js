let crowdFundsTest = artifacts.require("./crowdfund.sol");

contract("CrowdFund",function(accounts){

let contract;
let contractCreatore=accounts[0];
let beneficiary =accounts[1];

const ONE_ETH = 1000000000000000000;

const OnGoing="0";
const Failed = "1";
const Succedded = "2";
const PaidOut = "3";

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

it("Contract Created Success"),async function(){
    let comName = await contract.name.call()
    expect(comName).to.equal('New funding');

    let targetAmount = await contract.targetAmount.call()
    expect(targetAmount.toNumber()).to.equal(ONE_ETH);

    let actualBenef = await contract.beneficiary.call()
    expect(actualBenef).to.equal(beneficiary);

    let state = await contract.state.call()
    expect(state).to.equal(OnGoing);

}

});
