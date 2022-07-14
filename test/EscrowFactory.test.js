// we can check for reverts or emitted events using truffleAssert
// it uses chai under the hood.
const truffleAssert = require("truffle-assertions");

const EscrowFactory = artifacts.require("EscrowFactory");
const EscrowWithAgent = artifacts.require("EscrowWithAgent");

// to assert for enums, as enums return numbers
const Stages = {
  OPEN: 0,
  ONGOING: 1,
  CLOSED: 2
};

//accounts[0] is the default account
contract("EscrowFactory", (accounts) => {
  let escrowFactoryInstance;

  before(async () => {
    // positive test 1

    // this is not the constructor call
    // **deployer.deploy()** function in **2_deploy_contracts.js** is where the SC is deployed
    escrowFactoryInstance = await EscrowFactory.deployed();
    assert(
      escrowFactoryInstance !== undefined,
      "EscrowWithAgent contract should be defined"
    );
  });

  // negetive test 1
  describe("creating a clone and depositing with accounts[1] and releasing with accounts[0]", async () => {
    const depositedValue = 20;
    let escrowInstance;
    let escrowInstanceAddr;
    it("creating a new child clone", async () => {
      // the new escrow with both parties gets generated
      const childResult = await escrowFactoryInstance.createChild(
        accounts[1],
        accounts[2],
        depositedValue
      );
      // taking the newly generated escrow address from the emit
      await truffleAssert.eventEmitted(
        childResult,
        "escrowCreated",
        (event) => {
          escrowInstanceAddr = event.newEscrowAddr; // just taking the value of "newEscrowAddr"

          return true; // to make the assert true
        },
        "escrowCreated event should emit"
      );

      escrowInstance = await EscrowWithAgent.at(escrowInstanceAddr); // converting address to EscrowWithAgent contact
      //   console.log(escrowInstance);

      assert(
        escrowInstance !== undefined,
        "escrowInstance contract should be defined"
      );
    });

    //   await escrowFactoryInstance.createChild(accounts[1], accounts[0], depositedValue);
    //   await escrowFactoryInstance.createChild(accounts[1], accounts[0], depositedValue);
    //   escrowInstance = await escrowFactoryInstance.getChildren();
    // it("creating a new child clone", async () => {});

    // negetive test 1
    it("depositing with accounts[4]", async () => {
      await truffleAssert.reverts(
        // the first param could be a argument passed to the deposit() method. But deposit() doesn't take one.
        // deposit(param1, param2, {value, form});
        escrowInstance.deposit({
          // value: Number.toString(web3.utils.fromWei(20, 'ether')), // 20 ether
          // value: web3.utils.fromWei(web3.utils.toBN(20), "ether"), // 20 ether
          value: depositedValue, // 20 gwei
          from: accounts[4]
        })
      );
    });

    let result;
    // positive test 1
    it("depositing with accounts[1] for 'stageChange'", async () => {
      result = await escrowInstance.deposit({
        // value: Number.toString(web3.utils.fromWei(20, 'ether')), // 20 ether
        // value: web3.utils.fromWei(web3.utils.toBN(20), "ether"), // 20 ether
        value: depositedValue, // 20 gwei
        from: accounts[1]
      });

      assert.equal(true, result.receipt.status, "status should be true");

      //   handle event for "stageChange" event
      await truffleAssert.eventEmitted(
        result,
        "stageChange",
        (event) => {
          // to check if event is emitted with correct parameter
          // for EscrowWithAgent it's currentStage
          return event.currentStage == Stages.ONGOING;
        },
        "The stage should be ONGOING"
      );
      // handle event for "deposited" event
      await truffleAssert.eventEmitted(
        result,
        "deposited",
        (event) => {
          // to check if event is emitted with correct parameter
          // for EscrowWithAgent it's currentStage
          return (
            event.currentStage == Stages.ONGOING &&
            event.amount == depositedValue
          );
        },
        `The stage should be ONGOING and amount should be ${depositedValue}`
      );
    });

    // negetive test 2:
    it("releasing with accounts[1] who is not the agent", async () => {
      await truffleAssert.reverts(
        // the first param could be a argument passed to the deposit() method. But deposit() doesn't take one.
        // deposit(param1, param2, {value, form});
        escrowInstance.release({
          value: depositedValue, // 20 gwei
          from: accounts[1]
        })
      );
    });

    // negetive test 3:
    it("revertEscrow with accounts[1] who is not the agent", async () => {
      await truffleAssert.reverts(
        // the first param could be a argument passed to the deposit() method. But deposit() doesn't take one.
        // deposit(param1, param2, {value, form});
        escrowInstance.revertEscrow({
          from: accounts[1]
        })
      );
    });

    // positive test 2
    it("releasing with accounts[0] for 'stageChange'", async () => {
      result = await escrowInstance.release({
        from: accounts[0]
      });

      assert.equal(true, result.receipt.status, "status should be true");

      //   handle event for "stageChange" event
      await truffleAssert.eventEmitted(
        result,
        "stageChange",
        (event) => {
          // to check if event is emitted with correct parameter
          // for EscrowWithAgent it's currentStage
          return event.currentStage == Stages.CLOSED;
        },
        "The stage should be CLOSED"
      );
      // handle event for "deposited" event
      await truffleAssert.eventEmitted(
        result,
        "released",
        (event) => {
          // to check if event is emitted with correct parameter
          // for EscrowWithAgent it's currentStage
          return (
            event.currentStage == Stages.CLOSED &&
            event.amount == depositedValue
          );
        },
        `The stage should be CLOSED and amount should be ${depositedValue}`
      );
    });

  });

  describe("access public array variables", async () => {
    it("access 'escrows' array's idx 0 from EscrowFactory", async () => {
      // calling public variable
      const eAdd = await escrowFactoryInstance.escrows(0); // get value of an array "escrows" idx 0
      console.log(`address of escrows[0] ${eAdd}`);
      assert(true);
    });
  })

});
