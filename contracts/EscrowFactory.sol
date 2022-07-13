// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./CloneFactory.sol";
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
            createClone(masterContract)
        );
        newEscrow.init(_payer, _payee, _amount);
        escrows.push(newEscrow);
        emit escrowCreated(address(newEscrow)); // emmits the address of the newly created contract
    }

    function getChildren() external view returns (EscrowWithAgent[] memory) {
        return escrows;
    }
}
