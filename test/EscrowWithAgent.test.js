// we can check for reverts or emitted events using truffleAssert
// it uses chai under the hood.
const truffleAssert = require("truffle-assertions");

const EscrowWithAgent = artifacts.require("EscrowWithAgent");

// to assert for enums, as enums return numbers
const Stages = {
  OPEN: 0,
  ONGOING: 1,
  CLOSED: 2
};

//accounts[0] is the default account
contract("EscrowWithAgent", (accounts) => {
  let escrowWithAgentInstance;

  before(async () => {
    // positive test 1

    // this is not the constructor call
    // **deployer.deploy()** function in **2_deploy_contracts.js** is where the SC is deployed
    escrowWithAgentInstance = await EscrowWithAgent.deployed();

    assert(
      escrowWithAgentInstance !== undefined,
      "EscrowWithAgent contract should be defined"
    );

  });

  // calling public variable
  // auctionInstance.winners(2);  // an array "winner" with idx 2

  // positive test 1
  describe("depositing with address[1] and releasing with address[0]", async () => {
    const depositedValue = 20;
    let result;
    it("depositing with address[1] for 'stageChange'", async () => {
      result = await escrowWithAgentInstance.deposit({
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
          return event.currentStage == Stages.ONGOING && event.amount == depositedValue;
        },
        `The stage should be ONGOING and amount should be ${depositedValue}`
      );

    });
    it("releasing with address[0] for 'stageChange'", async () => {
      result = await escrowWithAgentInstance.release({
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
          return event.currentStage == Stages.CLOSED && event.amount == depositedValue;
        },
        `The stage should be CLOSED and amount should be ${depositedValue}`
      );

    });
  });
  // positive test 2
 
  
  // // negetive event test 1
  // describe("registering with the addresses", async () => {
  //   it("register with address[5] by himself - should fail", async () => {
  //     // truffleAssert uses chai under the hood.
  //     // we can check for reverts using this
  //     await truffleAssert.reverts(
  //       ballotInstance.register(accounts[5], {
  //         // we can pass the contract.method() call directly as param
  //         from: accounts[5]
  //       })
  //     );
  //   });
  // });
});
