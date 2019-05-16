var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    var sku = 1
    var upc = 1

    const productID = 12345
    const ownerID = accounts[0]
    const companyID = accounts[1]
    const manufacturerID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]

    const manufacturerName = "Cartamundi"
    const manufacturerInformation = "Cartamundi East Longmeadow LLC"
    const manufacturerLatitude = "-38.239770"
    const manufacturerLongitude = "144.341490"
    const productNotes = "Magic: The Gathering, War of the Spark Booster Box"
    const productPrice = web3.toWei(1, "ether")

    it("Testing designItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.designItem(
        upc, companyID, productID, productNotes, productPrice);
      let event = tx.logs[0].event;

      const productData = await supplyChain.fetchProductData.call(upc);
      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productData[0], companyID, 'Invalid companyID');
      assert.equal(productData[1], productID, 'Invalid productID');
      assert.equal(productData[2], productNotes, 'Invalid productNotes');
      assert.equal(productData[3], productPrice, 'Invalid productPrice');
      assert.equal(productState, 0, 'Invalid item State');
      assert.equal(event, 'Designed', 'Invalid event emitted');
    });

    it("Testing manufactureItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.manufactureItem(
        upc, manufacturerID, manufacturerName,
        manufacturerInformation, manufacturerLatitude, manufacturerLongitude);
      let event = tx.logs[0].event;

      const manufacturerData = (
        await supplyChain.fetchManufacturerData.call(upc));
      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(
        manufacturerData[0], manufacturerID, 'Invalid manufacturerID');
      assert.equal(
        manufacturerData[1], manufacturerName,
        'Invalid manufacturerInformation');
      assert.equal(
        manufacturerData[2], manufacturerInformation,
        'Invalid manufacturerInformation');
      assert.equal(
        manufacturerData[3], manufacturerLatitude,
        'Invalid manufacturerLatitude');
      assert.equal(manufacturerData[4], manufacturerLongitude,
        'Invalid manufacturerLongitude');
      assert.equal(productState, 1, 'Invalid item State');
      assert.equal(event, 'Manufactured', 'Invalid event emitted');
    });

    it("Testing packageItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.packageItem(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 2, 'Invalid item State');
      assert.equal(event, 'Packaged', 'Invalid event emitted');
    });

    it("Testing sellItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.sellItem(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 3, 'Invalid item State');
      assert.equal(event, 'ForSale', 'Invalid event emitted');
    });

    it("Testing buyItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let errorThrown;
      const underpaidPrice = web3.toWei(.5, "ether")

      try {
        await supplyChain.buyItem(
          upc, retailerID, productPrice,
          {value: underpaidPrice, gasPrice: 0});
      } catch (error) {
        errorThrown = error;
      }
      assert.notEqual(
        errorThrown, undefined,
        'Revert error not thrown for not paying enough');
      assert.isAbove(
        errorThrown.message.search('Not Paid Enough'),
        -1, 'Revert error not thrown for not paying enough');

      const balanceBeforeTransaction = web3.eth.getBalance(ownerID);
      let tx = await supplyChain.buyItem(
        upc, retailerID, productPrice, {value: productPrice, gasPrice: 0});
      const balanceAfterTransaction = web3.eth.getBalance(ownerID);
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(
          balanceBeforeTransaction.sub(balanceAfterTransaction), productPrice);
      assert.equal(productState, 4, 'Invalid item State');
      assert.equal(event, 'Sold', 'Invalid event emitted');
    });

    it("Testing shippedItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.shipItem(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 5, 'Invalid item State');
      assert.equal(event, 'Shipped', 'Invalid event emitted');
    });

    it("Testing receiveItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.receiveItem(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 6, 'Invalid item State');
      assert.equal(event, 'Received', 'Invalid event emitted');
    });

    it("Testing stockItem()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.stockItem(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 7, 'Invalid item State');
      assert.equal(event, 'Stocked', 'Invalid event emitted');
    });

    it("Testing purchaseItem()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const consumerPrice = productPrice * 2;

      let errorThrown;
      const underpaidPrice = web3.toWei(1, "ether")

      try {
        await supplyChain.purchaseItem(
          upc, consumerID, consumerPrice,
          {value: underpaidPrice, gasPrice: 0});
      } catch (error) {
        errorThrown = error;
      }
      assert.notEqual(
        errorThrown, undefined,
        'Revert error not thrown for not paying enough');
      assert.isAbove(
        errorThrown.message.search('Not Paid Enough'),
        -1, 'Revert error not thrown for not paying enough');

      const balanceBeforeTransaction = web3.eth.getBalance(ownerID);
      let tx = await supplyChain.purchaseItem(
        upc, consumerID, consumerPrice, {value: consumerPrice, gasPrice: 0});
      const balanceAfterTransaction = web3.eth.getBalance(ownerID);
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(
        balanceBeforeTransaction.sub(balanceAfterTransaction),
        consumerPrice);
      assert.equal(productState, 8, 'Invalid item State');
      assert.equal(event, 'Purchased', 'Invalid event emitted');
    });
});

