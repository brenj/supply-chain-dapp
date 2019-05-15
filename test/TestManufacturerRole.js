const ManufacturerRole = artifacts.require('ManufacturerRole');
const REVERT_ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('ManufacturerRole', function(accounts) {
  const ownerID = accounts[0];
  const companyID = accounts[1];
  const manufacturerID = accounts[2];

  it("Testing ManufacturerRole", async() => {
    const manufacturerRole = await ManufacturerRole.deployed();

    let errorThrown;

    try {
      await manufacturerRole.addManufacturer(
        manufacturerID, { from: companyID });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown, undefined, 'Revert error not thrown for onlyManufacturer');
    assert.isAbove(
      errorThrown.message.search(REVERT_ERROR_MSG),
      -1, `Revert error not thrown for onlyManufacturer`);

    assert.equal(
      await manufacturerRole.isManufacturer(
        manufacturerID), false, 'Shouldn\'t be a valid manufacturer');
    let tx = await manufacturerRole.addManufacturer(
      manufacturerID, { from: ownerID });
    assert.equal(
      await manufacturerRole.isManufacturer(
        manufacturerID), true, 'Should be a valid manufacturer');

    let event = tx.logs[0].event
    assert.equal(event, 'ManufacturerAdded', 'Should have emitted an event');
  });
});

