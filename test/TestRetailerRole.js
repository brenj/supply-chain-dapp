const RetailerRole = artifacts.require('RetailerRole');
const REVERT_ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('RetailerRole', function(accounts) {
  const ownerID = accounts[0];
  const manufacturerID = accounts[1];
  const retailerID = accounts[2];

  it("Testing RetailerRole", async() => {
    const retailerRole = await RetailerRole.deployed();

    let errorThrown;

    try {
      await retailerRole.addRetailer(retailerID, { from: manufacturerID });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown, undefined, 'Revert error not thrown for onlyRetailer');
    assert.isAbove(
      errorThrown.message.search(REVERT_ERROR_MSG),
      -1, `Revert error not thrown for onlyRetailer`);

    assert.equal(
      await retailerRole.isRetailer(
        retailerID), false, 'Shouldn\'t be a valid retailer');
    let tx = await retailerRole.addRetailer(retailerID, { from: ownerID });
    assert.equal(
      await retailerRole.isRetailer(
        retailerID), true, 'Should be a valid retailer');

    let event = tx.logs[0].event;
    assert.equal(event, 'RetailerAdded', 'Should have emitted an event');
  });
});
