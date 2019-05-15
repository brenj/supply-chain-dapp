const ConsumerRole = artifacts.require('ConsumerRole');
const REVERT_ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('ConsumerRole', function(accounts) {
  const ownerID = accounts[0];
  const retailerID = accounts[1];
  const consumerID = accounts[2];

  it("Testing ConsumerRole", async() => {
    const consumerRole = await ConsumerRole.deployed();

    let errorThrown;

    try {
      await consumerRole.addConsumer(consumerID, { from: retailerID });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown, undefined, 'Revert error not thrown for onlyConsumer');
    assert.isAbove(
      errorThrown.message.search(REVERT_ERROR_MSG),
      -1, `Revert error not thrown for onlyConsumer`);

    assert.equal(
      await consumerRole.isConsumer(
        consumerID), false, 'Shouldn\'t be a valid consumer');
    let tx = await consumerRole.addConsumer(consumerID, { from: ownerID });
    assert.equal(
      await consumerRole.isConsumer(
        consumerID), true, 'Should be a valid consumer');

    let event = tx.logs[0].event;
    assert.equal(event, 'ConsumerAdded', 'Should have emitted an event');
  });
});
