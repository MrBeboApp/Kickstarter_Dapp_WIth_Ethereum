// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./crowdfund.sol";

contract crowdfundTest  is  CrowdFund {

uint time;

constructor(string memory contractName,uint targetAmount,uint durationMinutes,address beneficiaryAdresss){
 CrowdFund(contractName,targetAmount,durationMinutes,beneficiaryAdresss);
}

    function currentTime() internal view returns(uint) {
        return time;
    }

    function setCurrentTime(uint newTime) public {
        time = newTime;
    }
}
