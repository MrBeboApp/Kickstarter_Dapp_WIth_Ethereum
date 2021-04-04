pragma solidity >=0.4.22 <0.9.0;

contract CrowdFund{
    //States for controll the contract in all fases
    enum State {
        OnGoing,Failed,Succedded,PaidOut
    }

string public name;
uint public targetAmpunt;
uint public fundingDeadline;
address public beneficiary;
State public state;



}