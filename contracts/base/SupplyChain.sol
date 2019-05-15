pragma solidity ^0.4.24;

import '../access_control/CompanyRole.sol';
import '../access_control/ManufacturerRole.sol';
import '../access_control/RetailerRole.sol';

contract SupplyChain is CompanyRole, ManufacturerRole, RetailerRole {

  address owner;
  uint upc;
  uint sku;

  // upc -> Item
  mapping (uint => Item) items;

  // upc -> TxHash
  mapping (uint => string[]) itemsHistory;
  
  enum State {
    Designed,     // 0
    Manufactured, // 1
    Packaged,     // 2
    ForSale,      // 3
    Sold,         // 4
    Shipped,      // 5
    Received,     // 6
    Stocked,      // 7
    Purchased     // 8
  }

  State constant defaultState = State.Designed;

  struct Item {
    uint sku;
    uint upc;

    address ownerID;
    address companyID;
    address retailerID;
    address consumerID;

    address manufacturerID;
    string manufacturerName;
    string manufacturerInformation;
    string manufacturerLatitude;
    string manufacturerLongitude;

    uint productID;
    string productNotes;
    uint productPrice;

    State itemState;
  }

  event Designed(uint upc);
  event Manufactured(uint upc);
  event Packaged(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Stocked(uint upc);
  event Purchased(uint upc);

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier verifyCaller (address _address) {
    require(msg.sender == _address); 
    _;
  }

  modifier paidEnough(uint _price) { 
    require(msg.value >= _price, 'Not Paid Enough');
    _;
  }
  
  modifier checkValue(uint _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    items[_upc].consumerID.transfer(amountToReturn);
  }

  modifier designed(uint _upc) {
    require(items[_upc].itemState == State.Designed);
    _;
  }

  modifier manufactured(uint _upc) {
    require(items[_upc].itemState == State.Manufactured);
    _;
  }
  
  modifier packaged(uint _upc) {
    require(items[_upc].itemState == State.Packaged);
    _;
  }

  modifier forSale(uint _upc) {
    require(items[_upc].itemState == State.ForSale);
    _;
  }

  modifier sold(uint _upc) {
    require(items[_upc].itemState == State.Sold);
    _;
  }
  
  modifier shipped(uint _upc) {
    require(items[_upc].itemState == State.Shipped);
    _;
  }

  modifier received(uint _upc) {
    require(items[_upc].itemState == State.Received);
    _;
  }

  modifier purchased(uint _upc) {
    require(items[_upc].itemState == State.Purchased);
    _;
  }

  constructor() public payable {
    owner = msg.sender;
    sku = 1;
    upc = 1;
  }

  function kill() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }

  function designItem(
      uint _upc,
      address _companyID,
      uint _productID,
      string _productNotes,
      uint _productPrice
  )
    public
    onlyCompany
  {
    Item memory product;
    product.upc = _upc;
    product.sku = sku;
    product.companyID = _companyID;
    product.productID = _productID;
    product.productNotes = _productNotes;
    product.productPrice = _productPrice;

    sku += 1;
    items[_upc] = product;
    emit Designed(_upc);
  }

  function manufactureItem(
      uint _upc,
      address _manufacturerID,
      string _manufacturerName,
      string _manufacturerInformation,
      string _manufacturerLatitude,
      string _manufacturerLongitude
  )
    public
    onlyManufacturer
    designed(_upc)
  {
    Item storage product = items[_upc];
    product.manufacturerID = _manufacturerID;
    product.manufacturerName = _manufacturerName;
    product.manufacturerInformation = _manufacturerInformation;
    product.manufacturerLatitude = _manufacturerLatitude;
    product.manufacturerLongitude = _manufacturerLongitude;
    product.itemState = State.Manufactured;

    emit Manufactured(_upc);
  }

  function packageItem(uint _upc) public onlyManufacturer manufactured(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Packaged;
    emit Packaged(_upc);
  }

  function sellItem(uint _upc) public onlyManufacturer packaged(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.ForSale;
    emit ForSale(_upc);
  }

  function buyItem(uint _upc, address _retailerID, uint _price)
    public
    onlyRetailer
    forSale(_upc)
    payable
    paidEnough(_price)
    checkValue(_upc)
  {
    Item storage product = items[_upc];
    product.ownerID = _retailerID;
    product.retailerID = _retailerID;
    product.itemState = State.Sold;

    _retailerID.transfer(_price);

    emit Sold(_upc);
  }

  // // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
  // // Use the above modifers to check if the item is sold
  // function shipItem(uint _upc) public 
  //   // Call modifier to check if upc has passed previous supply chain stage
    
  //   // Call modifier to verify caller of this function
    
  //   {
  //   // Update the appropriate fields
    
  //   // Emit the appropriate event
    
  // }

  // // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
  // // Use the above modifiers to check if the item is shipped
  // function receiveItem(uint _upc) public 
  //   // Call modifier to check if upc has passed previous supply chain stage
    
  //   // Access Control List enforced by calling Smart Contract / DApp
  //   {
  //   // Update the appropriate fields - ownerID, retailerID, itemState
    
  //   // Emit the appropriate event
    
  // }

  // // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
  // // Use the above modifiers to check if the item is received
  // function purchaseItem(uint _upc) public 
  //   // Call modifier to check if upc has passed previous supply chain stage
    
  //   // Access Control List enforced by calling Smart Contract / DApp
  //   {
  //   // Update the appropriate fields - ownerID, consumerID, itemState
    
  //   // Emit the appropriate event
    
  // }

  function fetchState(uint _upc) public view returns (State) {
    Item memory product = items[_upc];
    return product.itemState;
  }

  function fetchProductData(uint _upc)
    public
    view
    returns (
        address,
        uint,
        string,
        uint
    )
  {
    Item memory product = items[_upc];
    return (
        product.companyID,
        product.productID,
        product.productNotes,
        product.productPrice
    );
  }

  function fetchManufacturerData(uint _upc)
    public
    view
    returns (
        address,
        string,
        string,
        string,
        string
    )
  {
    Item memory product = items[_upc];
    return (
        product.manufacturerID,
        product.manufacturerName,
        product.manufacturerInformation,
        product.manufacturerLatitude,
        product.manufacturerLongitude
    );
  }

  // // Define a function 'fetchItemBufferTwo' that fetches the data
  // function fetchItemBufferTwo(uint _upc) public view returns 
  // (
  // uint    itemSKU,
  // uint    itemUPC,
  // uint    productID,
  // string  productNotes,
  // uint    productPrice,
  // uint    itemState,
  // address distributorID,
  // address retailerID,
  // address consumerID
  // ) 
  // {
  //   // Assign values to the 9 parameters
  
    
  // return 
  // (
  // itemSKU,
  // itemUPC,
  // productID,
  // productNotes,
  // productPrice,
  // itemState,
  // distributorID,
  // retailerID,
  // consumerID
  // );
  // }
}
