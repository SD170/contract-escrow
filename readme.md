# Escrow contract

Solidity contract to create escrow agreement. Total 3 parties involved: a payer, a payee and an agent. The escrow amount and stages are handled by the agent.
Developed using truffle, with tests for all specific events.

For the factory contract switch to the other branch.

## Contracts

| file | description |
| ------ | ------ |
| EscrowWithAgent.sol | holds the actual escrow logic. |


## Installation

you need to have truffle and ganache-cli installed

1) Run ganache-cli in a terminal
```
ganache-cli 
```
2) After cloning this repository, go to `/contract` and try to compile using
```
truffle compile
```
3) migrate the contract (deploy the contract to the ETH blockchain for me local) **only works if ganache-cli is running**
```
truffle migrate --reset
```

4) run the tests
```
truffle test
```

#### Thanks for checking out !!!

