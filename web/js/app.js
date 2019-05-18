App = {
    web3Provider: null,
    contracts: {},
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    ownerID: "0x0000000000000000000000000000000000000000",
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
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.companyID = $("#companyID").val();
        App.productID = $("#productID").val();
        App.manufacturerID = $("#manufacturerID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        App.manufacturerName = $("#manufacturerName").val();
        App.manufacturerInformation = $("#manufacturerInformation").val();
        App.manufacturerLatitude = $("#manufacturerLatitude").val();
        App.manufacturerLongitude = $("#manufacturerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.companyID, 
            App.manufacturerID, 
            App.retailerID, 
            App.consumerID,
            App.manufacturerName, 
            App.manufacturerInformation, 
            App.manufacturerLatitude, 
            App.manufacturerLongitude, 
            App.productNotes, 
            App.productPrice
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        // if (window.ethereum) {
        //     App.web3Provider = window.ethereum;
        //     try {
        //         // Request account access
        //         await window.ethereum.enable();
        //     } catch (error) {
        //         // User denied account access...
        //         console.error("User denied account access")
        //     }
        // }
        // // Legacy dapp browsers...
        // else if (window.web3) {
        //     App.web3Provider = window.web3.currentProvider;
        // }
        // // If no injected web3 instance is detected, fall back to Ganache
        // else {
        //     console.log("GOT HERE");
        //     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        // }

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
            
            App.fetchState();
            App.fetchProductData();
            App.fetchManufacturerData();
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
          console.log(App.upc, App.companyID, App.productID, App.productNotes, App.productPrice);
            return instance.designToy(
                App.upc, 
                App.companyID,
                App.productID,
                App.productNotes,
                App.productPrice
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('designToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    manufactureToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.manufactureToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('manufactureToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packageToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packageToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packageToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellToy(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellToy',result);
        }).catch(function(err) {
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
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchState(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchState', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchProductData: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchProductData.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchProductData', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchManufacturerData: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchManufacturerData.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
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
