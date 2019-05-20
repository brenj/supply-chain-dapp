App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        // Toy Details
        App.fetchUPC = $("#fetchUPC").val();

        // Design Toy
        App.designUPC = $("#designUPC").val();
        App.designSKU = $("#designSKU").val();
        App.productID = $("#productID").val();
        App.productNotes = $("#productNotes").val();

        // Manufacture Toy
        App.manufacturerUPC = $("#manufacturerUPC").val();
        App.manufacturerName = $("#manufacturerName").val();
        App.manufacturerInformation = $("#manufacturerInformation").val();
        App.manufacturerLatitude = $("#manufacturerLatitude").val();
        App.manufacturerLongitude = $("#manufacturerLongitude").val();

        // Package Toy
        App.packageUPC = $("#packageUPC").val();

        // Sell Toy
        App.sellUPC = $("#sellUPC").val();
        App.sellPrice = $("#sellPrice").val();

        // Buy Toy
        App.buyUPC = $("#buyUPC").val();

        // Ship Toy
        App.shipUPC = $("#shipUPC").val();

        // Receive Toy
        App.receiveUPC = $("#receiveUPC").val();

        // Stock Toy
        App.stockUPC = $("#stockUPC").val();
        App.retailPrice = $("#retailPrice").val();

        // Purchase Toy
        App.purchaseUPC = $("#purchaseUPC").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            console.log("GOT HERE");
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchEvents();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        App.readForm();

        switch(processId) {
            case 1:
                return await App.designToy(event);
                break;
            case 2:
                return await App.manufactureToy(event);
                break;
            case 3:
                return await App.packageToy(event);
                break;
            case 4:
                return await App.sellToy(event);
                break;
            case 5:
                return await App.buyToy(event);
                break;
            case 6:
                return await App.shipToy(event);
                break;
            case 7:
                return await App.receiveToy(event);
                break;
            case 8:
                return await App.stockToy(event);
                break;
            case 9:
                return await App.purchaseToy(event);
                break;
            case 10:
                return await App.fetchState(event);
                break;
            case 11:
                return await App.fetchProductData(event);
                break;
            case 12:
                return await App.fetchManufacturerData(event);
                break;
            }
    },

    designToy: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.designToy(
                App.designUPC, 
                App.designSKU, 
                App.productID,
                App.productNotes
            );
        }).then(function(result) {
            designOutput = `
              ✓ TOY DESIGNED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#designOutput").text(designOutput);

            $("#designUPC").val('');
            $("#designSKU").val('');
            $("#productID").val('');
            $("#productNotes").val('');

            console.log('designToy',result);
        }).catch(function(err) {
          designError = `
            ✗ TOY NOT DESIGNED
            See console logs for details
          `;
            $("#designOutput").text(designError);
            console.log(err.message);
        });
    },

    manufactureToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.manufactureToy(
            App.manufacturerUPC, App.manufacturerName,
            App.manufacturerInformation, App.manufacturerLatitude,
            App.manufacturerLongitude);
        }).then(function(result) {
          manufactureOutput = `
              ✓ TOY MANUFACTURED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#manufacturerOutput").text(manufactureOutput);

            $("#manufacturerUPC").val('');
            $("#manufacturerName").val('');
            $("#manufacturerInformation").val('');
            $("#manufacturerLatitude").val('');
            $("#manufacturerLongitude").val('');

            console.log('manufactureToy',result);
        }).catch(function(err) {
            manufactureError = `
              ✗ TOY NOT MANUFACTURED
              See console logs for details
            `;
            $("#manufacturerOutput").text(manufactureError);
            console.log(err.message);
        });
    },
    
    packageToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packageToy(App.packageUPC);
        }).then(function(result) {
            packageOutput = `
              ✓ TOY PACKAGED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#packageOutput").text(packageOutput);
            $("#packageUPC").val('');

            console.log('packageToy',result);
        }).catch(function(err) {
            packageError = `
              ✗ TOY NOT PACKAGED
              See console logs for details
            `;
            $("#packageOutput").text(packageError);
            console.log(err.message);
        });
    },

    sellToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            console.log(App.sellUPC, App.sellPrice);
            return instance.sellToy(App.sellUPC, App.sellPrice);
        }).then(function(result) {
            sellOutput = `
              ✓ TOY PUT UP FOR SALE
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#sellOutput").text(sellOutput);
            $("#sellUPC").val('');
            $("#sellPrice").val('');

            console.log('sellToy',result);
        }).catch(function(err) {
            sellError = `
              ✗ TOY NOT PUT UP FOR SALE
              See console logs for details
            `;
            $("#sellOutput").text(sellError);
            console.log(err.message);
        });
    },

    buyToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyToy(App.buyUPC, {value: walletValue});
        }).then(function(result) {
            buyOutput = `
              ✓ TOY BOUGHT
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#buyOutput").text(buyOutput);
            $("#buyUPC").val('');
            console.log('buyToy',result);
        }).catch(function(err) {
            buyError = `
              ✗ TOY NOT BOUGHT
              See console logs for details
            `;
            $("#buyOutput").text(buyError);
            console.log(err.message);
        });
    },

    shipToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipToy(App.shipUPC);
        }).then(function(result) {
            shipOutput = `
              ✓ TOY SHIPPED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#shipOutput").text(shipOutput);
            $("#shipUPC").val('');
            console.log('shipToy',result);
        }).catch(function(err) {
            buyError = `
              ✗ TOY NOT SHIPPED
              See console logs for details
            `;
            $("#shipOutput").text(shipError);
            console.log(err.message);
        });
    },

    receiveToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveToy(App.receiveUPC);
        }).then(function(result) {
            receiveOutput = `
              ✓ TOY RECEIVED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#receiveOutput").text(receiveOutput);
            $("#receiveUPC").val('');
            console.log('receiveToy',result);
        }).catch(function(err) {
            receiveError = `
              ✗ TOY NOT RECEIVED
              See console logs for details
            `;
            $("#shipOutput").text(receiveError);
            console.log(err.message);
        });
    },

    stockToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.stockToy(App.stockUPC, App.retailPrice);
        }).then(function(result) {
             stockOutput = `
              ✓ TOY STOCKED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#stockOutput").text(stockOutput);
            $("#stockUPC").val('');
            console.log('stockToy',result);
        }).catch(function(err) {
            stockError = `
              ✗ TOY NOT STOCKED
              See console logs for details
            `;
            $("#shipOutput").text(stockError);
            console.log(err.message);
        });
    },

    purchaseToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.purchaseToy(App.purchaseUPC, {value: walletValue});
        }).then(function(result) {
            purchaseOutput = `
              ✓ TOY PURCHASED
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#purchaseOutput").text(purchaseOutput);
            $("#purchaseUPC").val('');
            console.log('purchaseToy',result);
        }).catch(function(err) {
            console.log(err.message);
            purchaseError = `
              ✗ TOY NOT PURCHASED
              See console logs for details
            `;
            $("#purchaseOutput").text(purchaseError);
        });
    },

    fetchState: function () {
        console.log('upc',App.fetchUPC);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchState(App.fetchUPC);
        }).then(function(result) {
          let [upc, sku, state] = result;
          output = `
            UPC: ${upc}
            SKU: ${sku}
            Toy State: ${state}
          `;
          $("#fetchOutput").text(output);
          console.log('fetchState', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchProductData: function () {
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchProductData.call(App.fetchUPC);
        }).then(function(result) {
          let [upc, sku, companyID, productID, productNotes, productPrice] = result;
          let output = `
            UPC: ${upc}
            SKU: ${sku}
            Company ID: ${companyID}
            Toy ID: ${productID}
            Toy Notes: ${productNotes}
            Toy Price: ${productPrice} ETH
            `
          $("#fetchOutput").text(output);
          console.log('fetchProductData', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchManufacturerData: function () {
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchManufacturerData.call(App.fetchUPC);
        }).then(function(result) {
          let [upc, sku, manufacturerID, manufacturerName, manufacturerInformation, manufacturerLatitude, manufacturerLongitude] = result;
          let output = `
            UPC: ${upc}
            SKU: ${sku}
            Manufacturer ID: ${manufacturerID}
            Manufacturer Name: ${manufacturerName}
            Manufacturer Information: ${manufacturerInformation}
            Manufacturer Latitude: ${manufacturerLatitude}
            Manufacturer Longitude: ${manufacturerLongitude}
            `
          $("#fetchOutput").text(output);
          console.log('fetchManufacturerData', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#transactionHistory").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
