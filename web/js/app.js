App = {
    web3Provider: null,
    contracts: {},
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    upc: 0,
    companyID: "0x0000000000000000000000000000000000000000",
    manufacturerID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    manufacturerName: null,
    manufacturerInformation: null,
    manufacturerLatitude: null,
    manufacturerLongitude: null,
    productNotes: null,
    productPrice: 0,

    init: async function () {
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.fetchUPC = $("#fetchUPC").val();

        App.designUPC = $("#designUPC").val();
        App.designSKU = $("#designSKU").val();
        App.companyID = $("#companyID").val();
        App.productID = $("#productID").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();

        App.manufacturerUPC = $("#manufacturerUPC").val();
        App.manufacturerID = $("#manufacturerID").val();
        App.manufacturerName = $("#manufacturerName").val();
        App.manufacturerInformation = $("#manufacturerInformation").val();
        App.manufacturerLatitude = $("#manufacturerLatitude").val();
        App.manufacturerLongitude = $("#manufacturerLongitude").val();

        App.packageUPC = $("#packageUPC").val();

        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
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
            App.metamaskAccountID = res[0];

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
                App.companyID,
                App.productID,
                App.productNotes,
                App.productPrice
            );
        }).then(function(result) {
          designOutput = `
            ✓ TOY DESIGNED
            Transaction: ${result['logs'][0]['transactionHash']}
          `;
            $("#designOutput").text(designOutput);
            console.log('designToy',result);
        }).catch(function(err) {
          designError = `
            ✗ TOY NOT DESIGNED
            See console logs for details
          `;
            $("#designOutput").text(designError);
            console.log(err.message);
        }).finally(function() {
            $("#designUPC").val('');
            $("#designSKU").val('');
            $("#companyID").val('');
            $("#productID").val('');
            $("#productNotes").val('');
            $("#productPrice").val('');
        });
    },

    manufactureToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.manufactureToy(
            App.manufacturerUPC, App.manufacturerID, App.manufacturerName,
            App.manufacturerInformation, App.manufacturerLatitude,
            App.manufacturerLongitude);
        }).then(function(result) {
          manufactureOutput = `
            ✓ TOY MANUFACTURED
            Transaction: ${result['logs'][0]['transactionHash']}
          `;
            $("#manufacturerOutput").text(manufactureOutput);
            console.log('manufactureToy',result);
        }).catch(function(err) {
            manufactureError = `
              ✗ TOY NOT MANUFACTURED
              See console logs for details
            `;
            $("#manufacturerOutput").text(manufactureError);
            console.log(err.message);
        }).finally(function() {
            $("#manufacturerUPC").val('');
            $("#manufacturerID").val('');
            $("#manufacturerName").val('');
            $("#manufacturerInformation").val('');
            $("#manufacturerLatitude").val('');
            $("#manufacturerLongitude").val('');
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
            return instance.sellToy(App.packageUPC);
        }).then(function(result) {
            sellOutput = `
              ✓ TOY PUT UP FOR SALE
              Transaction: ${result['logs'][0]['transactionHash']}
            `;
            $("#packageOutput").text(sellOutput);
            console.log('sellToy',result);
        }).catch(function(err) {
            sellError = `
              ✗ TOY NOT PUT UP FOR SALE
              See console logs for details
            `;
            $("#packageOutput").text(sellError);
            console.log(err.message);
        });
    },

    buyToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyToy(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    stockToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.stockToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('stockToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchState: function () {
        App.upc = $('#fetchUPC').val();
        console.log('upc',App.fetchUPC);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchState(App.fetchUPC);
        }).then(function(result) {
          output = `
            Product State: ${result}
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
          let [companyID, productID, productNotes, productPrice] = result;
          let output = `
            Company ID: ${companyID}
            Product ID: ${productID}
            Product Notes: ${productNotes}
            Product Price: ${productPrice} ETH
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
          let [manufacturerID, manufacturerName, manufacturerInformation, manufacturerLatitude, manufacturerLongitude] = result;
          let output = `
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
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
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
