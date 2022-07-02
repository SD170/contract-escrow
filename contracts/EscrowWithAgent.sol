// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/// @title An escrow contract with a third-party agent
/// @author SD17
/// @notice this contract holds some ether from a payer. Keeps it until the third-party agent desides to send the ether to the payee
contract Escrow {
    address public payer;
    address payable public payee; // payable: payees address needs to transfer the ether
    address public agent;
    uint256 public amount;
    Stages public currentStage;

    // OPEN: escrow contract is open; the payer hasn't paid yet
    // ONGOING: escrow contract is open; payer has paid; payee didn't receive the ether
    // CLOSED: payee received the ether
    enum Stages {
        OPEN,
        ONGOING,
        CLOSED
    }

    constructor(
        address _payer,
        address payable _payee,
        uint256 _amount
    ) {
        payer = _payer;
        payee = _payee;
        agent = msg.sender;
        amount = _amount; // the amount of real ether

        // the stage sets to OPEN
        currentStage = Stages.OPEN;
    }

    function deposit() public payable {
        require(msg.sender == payer, "Sender must be the payer");
        require(currentStage == Stages.OPEN, "Wrong stage, see current stage");
        require(
            address(this).balance <= amount,
            "Cant send more than specified amount"
        );

        // can be paid in multiple intervals.
        // each time checking if the full amount is given or not
        // if given then change the stage
        if (address(this).balance >= amount) {
            currentStage = Stages.ONGOING;
        }
    }

    function release() public {
        require(msg.sender == agent, "Only agent can release funds");
        require(currentStage == Stages.ONGOING);
        payee.transfer(amount);
        currentStage = Stages.CLOSED;
    }

    function stageOf() public view returns (Stages) {
        return currentStage;
    }
    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
