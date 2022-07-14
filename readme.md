# Escrow contract

Solidity contract to create escrow agreement. Total 3 parties involved: a payer, a payee and an agent. The escrow amount and stages are handled by the agent.
Developed using truffle, with tests for all specific events.

There can be multiple escrow contracts, generated using Clone factory pattern. see [link1](https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol), [link2](https://betterprogramming.pub/learn-solidity-the-factory-pattern-75d11c3e7d29) for references.

For the standalone contract switch to the other branch.

## Contracts

| file                | description                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| EscrowWithAgent.sol | holds the actual escrow logic.                                                                                                     |
| EscrowFactory.sol   | creates clone childs of the EscrowWithAgent contract.                                                                              |
| CloneFactory.sol    | needed to create the child clones. see [link](https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol) |

## Installation

you need to have truffle and ganache-cli installed

1. Run ganache-cli in a terminal

```
ganache-cli
```

2. After cloning this repository, go to `/contract` and try to compile using

```
truffle compile
```

3. migrate the contract (deploy the contract to the ETH blockchain for me local) **only works if ganache-cli is running**

```
truffle migrate --reset
```

4. run the tests

```
truffle test
```

#### Thanks for checking out !!!
