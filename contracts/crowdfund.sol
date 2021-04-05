pragma solidity >=0.4.22 <0.9.0;

contract CrowdFund{
    //States for controll the contract in all fases
    enum State {
        OnGoing,Failed,Succedded,PaidOut
    }

event CampaignFinished(
    address addr,
    uint totalCollected,
    bool succeeded
);

string public name;
uint public targetAmount;
uint public fundingDeadline;
address payable public beneficiary;
State public state;

//Funds list
mapping(address=>uint) public amounts;
//If collected or not
bool public collected;
//How many Contract Collected money
uint public totalCollected;


modifier inState(State expectedState){
    require(state == expectedState,"Invaild State");
    _;
}





constructor (string memory name,uint  targetAmount,uint  durationInmin,address  beneficiary) public{
name=name;
targetAmount = targetAmount * 1 ether;
fundingDeadline = currentTime() + durationInmin * 1 minutes;
beneficiary =beneficiary;
state = State.OnGoing;


}

function contribute() public payable inState(State.OnGoing){
    require(beforeDeadline(),"Can not contriute after deadline");
amounts[msg.sender] += msg.value;
totalCollected +=msg.value;

if(totalCollected >=targetAmount){

    collected = true;
  }
}

function finishFunds()public inState(State.OnGoing){
    require(!beforeDeadline(),"Can not finish the campain before deadline");

    if(!collected){
        state = State.Failed;
    }else {
        state = State.Succedded;
    }
    emit CampaignFinished(address(this),totalCollected,collected);
}

function beforeDeadline() public view returns(bool){
   
   return currentTime()< fundingDeadline;
  

}

function collect()public inState(State.OnGoing){

        if(beneficiary.send(totalCollected)){
            state = State.PaidOut;
        }else {
            state=State.Failed;
        }

}


 function withdraw() public inState(State.Failed) {
        require(amounts[msg.sender] > 0, "Nothing was contributed");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if (!msg.sender.send(contributed)) {
            amounts[msg.sender] = contributed;
        }
    }



//create function that tell the contract what is time now

function currentTime() internal view returns(uint){
    return block.timestamp;

}


}