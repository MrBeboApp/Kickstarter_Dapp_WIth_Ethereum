let crowdFundsTest = artifacts.require("./crowdfundTest.sol");
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
const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';

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

    let fundingDeadline=await contract.fundingDeadline.call();
    expect(fundingDeadline.toNumber).to.equal(600);

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


it('Can not Contribute after deadline', async function() {
    try {
        await contract.setCurrentTime(601);
        await contract.sendTransaction({
            value:ONE_ETH,
            from:contractCreatore
        });
        expect.fail();
        
    } catch (error) {
        expect(error.message).to.equal(ERROR_MSG);
    }
});



it('crowdfunding succeeded', async function() {
    await contract.contribute({value: ONE_ETH, from: contractCreatore});
    await contract.setCurrentTime(601);
    await contract.finishFunds();
    let state = await contract.state.call();

    expect(state.valueOf().toNumber()).to.equal(Succedded);
});

it('crowdfunding failed', async function() {
    await contract.setCurrentTime(601);
    await contract.finishFunds();
    let state = await contract.state.call();

    expect(state.valueOf().toNumber()).to.equal(Failed);
});


it('collected money paid out', async function() {
    await contract.contribute({value: ONE_ETH, from: contractCreatore});
    await contract.setCurrentTime(601);
    await contract.finishFunds();

    let initAmount = await web3.eth.getBalance(beneficiary);
    await contract.collect({from: contractCreatore});

    let newBalance = await web3.eth.getBalance(beneficiary);
    let difference = newBalance - initAmount;
    expect(ONE_ETH.isEqualTo(difference)).to.equal(true);

    let fundingState = await contract.state.call()
    expect(fundingState.valueOf().toNumber()).to.equal(PaidOut);
});

it('withdraw funds from the contract', async function() {
    await contract.contribute({value: ONE_ETH - 100, from: contractCreatore});
    await contract.setCurrentTime(601);
    await contract.finishFunds();

    await contract.withdraw({from: contractCreatore});
    let amount = await contract.amounts.call(contractCreatore);
    expect(amount.toNumber()).to.equal(0);
});


it('event is emitted', async function() {
    await contract.setCurrentTime(601);
    const transaction = await contract.finishFunds();

    const events = transaction.logs
    expect(events.length).to.equal(1);

    const event = events[0]
    expect(event.args.totalCollected.toNumber()).to.equal(0);
    expect(event.args.succeeded).to.equal(false);
});


});
