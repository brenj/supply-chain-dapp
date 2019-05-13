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
    const emptyAddress = '0x00000000000000000000000000000000000000'

    const manufacturerName = "Cartamundi"
    const manufacturerInformation = "Cartamundi East Longmeadow LLC"
    const manufacturerLatitude = "-38.239770"
    const manufacturerLongitude = "144.341490"
    const productNotes = "Magic: The Gathering, War of the Spark Booster Box"
    const productPrice = web3.toWei(1, "ether")

    it("Testing designItem()", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        var eventEmitted = false
        
        var event = supplyChain.Designed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        await supplyChain.designItem(
          upc, companyID, productID, productNotes, productPrice)

        const productData = await supplyChain.fetchProductData.call(upc)
        const productState = await supplyChain.fetchState.call(upc)

        assert.equal(productData[0], sku, 'Error: Invalid item SKU')
        assert.equal(productData[1], upc, 'Error: Invalid item UPC')
        assert.equal(productData[2], companyID, 'Error: Invalid companyID')
        assert.equal(productData[3], productID, 'Error: Invalid productID')
        assert.equal(productData[4], productNotes, 'Error: Invalid productNotes')
        assert.equal(productData[5], productPrice, 'Error: Invalid productPrice')
        assert.equal(productState, 0, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })    

    // // 2nd Test
    // it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Processed()
        

    //     // Mark an item as Processed by calling function processtItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
        
    // })    

    // // 3rd Test
    // it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Packed()
        

    //     // Mark an item as Packed by calling function packItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
        
    // })    

    // // 4th Test
    // it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event ForSale()
        

    //     // Mark an item as ForSale by calling function sellItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
          
    // })    

    // // 5th Test
    // it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Sold()
    //     var event = supplyChain.Sold()
        

    //     // Mark an item as Sold by calling function buyItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
        
    // })    

    // // 6th Test
    // it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Shipped()
        

    //     // Mark an item as Sold by calling function buyItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
              
    // })    

    // // 7th Test
    // it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Received()
        

    //     // Mark an item as Sold by calling function buyItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
             
    // })    

    // // 8th Test
    // it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()
        
    //     // Declare and Initialize a variable for event
        
        
    //     // Watch the emitted event Purchased()
        

    //     // Mark an item as Sold by calling function buyItem()
        

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        

    //     // Verify the result set
        
    // })    

    // // 9th Test
    // it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        
        
    //     // Verify the result set:
        
    // })

    // // 10th Test
    // it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
        
        
    //     // Verify the result set:
        
    // })

});

