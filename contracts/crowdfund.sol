pragma solidity >=0.4.22 <0.9.0;

contract CrowdFund{
    //States for controll the contract in all fases
    enum State {
        OnGoing,Failed,Succedded,PaidOut
    }

string public name;
uint public targetAmount;
uint public fundingDeadline;
address public beneficiary;
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
fundingDeadline = currentTime() +durationInmin * 1 minutes;
beneficiary =beneficiary;
state = State.OnGoing;


}

function contribute() public payable inState(State.OnGoing){
amounts[msg.sender] += msg.value;
totalCollected +=msg.value;

if(totalCollected >=targetAmount){

    collected = true;
  }
}


//create function that tell the contract what is time now

function currentTime() internal view returns(uint){
    return block.timestamp;

}

}