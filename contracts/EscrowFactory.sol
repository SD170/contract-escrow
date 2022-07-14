// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//See: https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol
import "./CloneFactory.sol"; // for creating clone child (takes less gas). 
import "./EscrowWithAgent.sol";

contract EscrowFactory is CloneFactory {
    EscrowWithAgent[] public escrows;
    address masterContract;

    event escrowCreated(address newEscrowAddr);

    constructor(address _masterContract) {
        masterContract = _masterContract;
    }

    function createChild(
        address payable _payer,
        address payable _payee,
        uint256 _amount
    ) external {
        EscrowWithAgent newEscrow = EscrowWithAgent(
            createClone(masterContract) // method of CloneFactory. Creates child colone.
        );
        newEscrow.init(_payer, _payee, msg.sender,_amount);
        escrows.push(newEscrow);
        emit escrowCreated(address(newEscrow)); // emmits the address of the newly created contract
    }

}
