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


constructor (
string memory name;
uint  targetAmount;
uint  durationInmin;
address  beneficiary;
){
name=name;
targetAmount = targetAmount * 1 ether;
fundingDeadline = currentTime() +durationInmin * 1 minutes;
beneficiary =beneficiary;
state = State.OnGoing;


}

//create function that tell the contract what is time now

function currentTime() internal view returns(uint){
    return now;

}

}