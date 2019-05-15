const CompanyRole = artifacts.require('CompanyRole');
const REVERT_ERROR_MSG = 'VM Exception while processing transaction: revert';

contract('CompanyRole', function(accounts) {
  const ownerID = accounts[0];
  const companyID = accounts[1];
  const retailerID = accounts[2];

  it("Testing CompanyRole", async() => {
    const companyRole = await CompanyRole.deployed();

    let errorThrown;

    try {
      await companyRole.addCompany(companyID, { from: retailerID });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown, undefined, 'Revert error not thrown for onlyCompany');
    assert.isAbove(
      errorThrown.message.search(REVERT_ERROR_MSG),
      -1, `Revert error not thrown for onlyCompany`);

    assert.equal(
      await companyRole.isCompany(
        companyID), false, 'Shouldn\'t be a valid company');
    let tx = await companyRole.addCompany(companyID, { from: ownerID });
    assert.equal(
      await companyRole.isCompany(
        companyID), true, 'Should be a valid company');

    let event = tx.logs[0].event
    assert.equal(event, 'CompanyAdded', 'Should have emitted an event');
  });
});

