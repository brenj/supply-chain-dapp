var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    const sku = 'MTG-BOX-G123-WSP'
    const upc = '042100005264'
    const ownerID = accounts[0]
    const productPrice = web3.toWei(1, "ether")

    it("Testing designToy()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const productID = 12345
      const productNotes = "Magic: The Gathering, War of the Spark Booster Box"

      let tx = await supplyChain.designToy(
        upc, sku, productID, productNotes, {from: ownerID});
      let event = tx.logs[0].event;

      const productData = await supplyChain.fetchProductData.call(upc);
      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productData[0], ownerID, 'Invalid companyID');
      assert.equal(productData[1], productID, 'Invalid productID');
      assert.equal(productData[2], productNotes, 'Invalid productNotes');
      assert.equal(productState, 0, 'Invalid item State');
      assert.equal(event, 'Designed', 'Invalid event emitted');
    });

    it("Testing manufactureToy()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const manufacturerID = accounts[2]
      const manufacturerName = "Cartamundi"
      const manufacturerInformation = "Cartamundi East Longmeadow LLC"
      const manufacturerLatitude = "-38.239770"
      const manufacturerLongitude = "144.341490"

      let tx = await supplyChain.manufactureToy(
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

    it("Testing packageToy()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.packageToy(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 2, 'Invalid item State');
      assert.equal(event, 'Packaged', 'Invalid event emitted');
    });

    it("Testing sellToy()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.sellToy(upc, productPrice)
      let event = tx.logs[0].event;

      const productData = await supplyChain.fetchProductData.call(upc);
      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productData[3], productPrice, 'Invalid productPrice');
      assert.equal(productState, 3, 'Invalid item State');
      assert.equal(event, 'ForSale', 'Invalid event emitted');
    });

    it("Testing buyToy()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const underpaidPrice = web3.toWei(.5, "ether")

      let errorThrown;
      try {
        await supplyChain.buyToy(upc, {value: underpaidPrice, gasPrice: 0});
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
      let tx = await supplyChain.buyToy(
        upc, {value: productPrice, gasPrice: 0});
      const balanceAfterTransaction = web3.eth.getBalance(ownerID);
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(
          balanceBeforeTransaction.sub(balanceAfterTransaction), productPrice);
      assert.equal(productState, 4, 'Invalid item State');
      assert.equal(event, 'Sold', 'Invalid event emitted');
    });

    it("Testing shippedToy()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.shipToy(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 5, 'Invalid item State');
      assert.equal(event, 'Shipped', 'Invalid event emitted');
    });

    it("Testing receiveToy()", async() => {
      const supplyChain = await SupplyChain.deployed();

      let tx = await supplyChain.receiveToy(upc)
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productState, 6, 'Invalid item State');
      assert.equal(event, 'Received', 'Invalid event emitted');
    });

    it("Testing stockToy()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const consumerPrice = productPrice * 2;

      let tx = await supplyChain.stockToy(upc, consumerPrice)
      let event = tx.logs[0].event;

      const productData = await supplyChain.fetchProductData.call(upc);
      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(productData[3], consumerPrice, 'Invalid productPrice');
      assert.equal(productState, 7, 'Invalid item State');
      assert.equal(event, 'Stocked', 'Invalid event emitted');
    });

    it("Testing purchaseToy()", async() => {
      const supplyChain = await SupplyChain.deployed();
      const consumerID = accounts[4]
      const consumerPrice = productPrice * 2;
      const underpaidPrice = web3.toWei(1, "ether")

      let errorThrown;
      try {
        await supplyChain.purchaseToy(
          upc, {value: underpaidPrice, gasPrice: 0});
      } catch (error) {
        errorThrown = error;
      }
      assert.notEqual(
        errorThrown, undefined,
        'Revert error not thrown for not paying enough');
      assert.isAbove(
        errorThrown.message.search('Not Paid Enough'),
        -1, 'Revert error not thrown for not paying enough');

      await supplyChain.addConsumer(consumerID);
      const balanceBeforeTransaction = web3.eth.getBalance(ownerID);
      let tx = await supplyChain.purchaseToy(
        upc, {from: consumerID, value: consumerPrice, gasPrice: 0});
      const balanceAfterTransaction = web3.eth.getBalance(ownerID);
      let event = tx.logs[0].event;

      const productState = await supplyChain.fetchState.call(upc);

      assert.equal(
        balanceAfterTransaction.sub(balanceBeforeTransaction),
        consumerPrice);
      assert.equal(productState, 8, 'Invalid item State');
      assert.equal(event, 'Purchased', 'Invalid event emitted');
    });
});
