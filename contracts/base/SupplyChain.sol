pragma solidity ^0.4.24;

import '../access_control/CompanyRole.sol';
import '../access_control/ManufacturerRole.sol';
import '../access_control/RetailerRole.sol';
import '../access_control/ConsumerRole.sol';
import '../core/Ownable.sol';

contract SupplyChain is Ownable, CompanyRole, ManufacturerRole, RetailerRole, ConsumerRole {

  // upc -> Item
  mapping (string => Item) items;

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
    string sku;
    string upc;

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

  event Designed(string upc);
  event Manufactured(string upc);
  event Packaged(string upc);
  event ForSale(string upc);
  event Sold(string upc);
  event Shipped(string upc);
  event Received(string upc);
  event Stocked(string upc);
  event Purchased(string upc);

  modifier paidEnough(uint _price) { 
    require(msg.value >= _price, "Not Paid Enough");
    _;
  }
  
  modifier checkValue(string _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    msg.sender.transfer(amountToReturn);
  }

  modifier designed(string _upc) {
    require(items[_upc].itemState == State.Designed, "Not designed");
    _;
  }

  modifier manufactured(string _upc) {
    require(items[_upc].itemState == State.Manufactured, "Not manufactured");
    _;
  }
  
  modifier packaged(string _upc) {
    require(items[_upc].itemState == State.Packaged, "Not packaged");
    _;
  }

  modifier forSale(string _upc) {
    require(items[_upc].itemState == State.ForSale, "Not for sale");
    _;
  }

  modifier sold(string _upc) {
    require(items[_upc].itemState == State.Sold, "Not sold");
    _;
  }
  
  modifier shipped(string _upc) {
    require(items[_upc].itemState == State.Shipped, "Not shipped");
    _;
  }

  modifier received(string _upc) {
    require(items[_upc].itemState == State.Received, "Not received");
    _;
  }

  modifier stocked(string _upc) {
    require(items[_upc].itemState == State.Stocked, "Not stocked");
    _;
  }

  modifier purchased(string _upc) {
    require(items[_upc].itemState == State.Purchased, "Not purchased");
    _;
  }

  constructor() public payable {
  }

  function kill() public onlyOwner {
    selfdestruct(owner());
  }

  function designToy(
      string _upc,
      string _sku,
      uint _productID,
      string _productNotes
  )
    public
    onlyCompany
  {
    Item memory product;
    product.upc = _upc;
    product.sku = _sku;
    product.ownerID = msg.sender;
    product.companyID = msg.sender;
    product.productID = _productID;
    product.productNotes = _productNotes;

    items[_upc] = product;
    emit Designed(_upc);
  }

  function manufactureToy(
      string _upc,
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
    product.manufacturerID = msg.sender;
    product.manufacturerName = _manufacturerName;
    product.manufacturerInformation = _manufacturerInformation;
    product.manufacturerLatitude = _manufacturerLatitude;
    product.manufacturerLongitude = _manufacturerLongitude;
    product.itemState = State.Manufactured;

    emit Manufactured(_upc);
  }

  function packageToy(
      string _upc
  )
    public
    onlyManufacturer
    manufactured(_upc)
  {
    Item storage product = items[_upc];
    product.itemState = State.Packaged;

    emit Packaged(_upc);
  }

  function sellToy(
      string _upc,
      uint _price
  )
    public
    onlyManufacturer
    packaged(_upc)
  {
    Item storage product = items[_upc];
    product.productPrice = _price;
    product.itemState = State.ForSale;

    emit ForSale(_upc);
  }

  function buyToy(string _upc)
    public
    payable
    onlyRetailer
    forSale(_upc)
    paidEnough(items[_upc].productPrice)
    checkValue(_upc)
  {
    Item storage product = items[_upc];

    // Store product owner before it's updated
    address productOwner = product.ownerID;

    product.ownerID = msg.sender;
    product.retailerID = msg.sender;
    product.itemState = State.Sold;

    productOwner.transfer(product.productPrice);

    emit Sold(_upc);
  }

  function shipToy(string _upc) public onlyManufacturer sold(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Shipped;

    emit Shipped(_upc);
  }

  function receiveToy(string _upc) public onlyRetailer shipped(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Received;

    emit Received(_upc);
  }

  function stockToy(
      string _upc,
      uint _price
  )
    public
    onlyRetailer
    received(_upc)
  {
    Item storage product = items[_upc];
    product.productPrice = _price;
    product.itemState = State.Stocked;

    emit Stocked(_upc);
  }

  function purchaseToy(string _upc)
    public
    payable
    onlyConsumer
    stocked(_upc)
    paidEnough(items[_upc].productPrice)
    checkValue(_upc)
  {
    Item storage product = items[_upc];

    // Store product owner before it's updated
    address productOwner = product.ownerID;

    product.ownerID = msg.sender;
    product.consumerID = msg.sender;
    product.itemState = State.Purchased;

    productOwner.transfer(product.productPrice);

    emit Purchased(_upc);
  }

  function fetchState(
    string _upc
  )
    public
    view
    returns (
        string,
        string,
        State
    )
  {
    Item memory product = items[_upc];
    return (
        product.upc,
        product.sku,
        product.itemState
    );
  }

  function fetchProductData(
    string _upc
  )
    public
    view
    returns (
        string,
        string,
        address,
        uint,
        string,
        uint
    )
  {
    Item memory product = items[_upc];
    return (
        product.upc,
        product.sku,
        product.companyID,
        product.productID,
        product.productNotes,
        product.productPrice
    );
  }

  function fetchManufacturerData(
      string _upc
  )
    public
    view
    returns (
        string,
        string,
        address,
        string,
        string,
        string,
        string
    )
  {
    Item memory product = items[_upc];
    return (
        product.upc,
        product.sku,
        product.manufacturerID,
        product.manufacturerName,
        product.manufacturerInformation,
        product.manufacturerLatitude,
        product.manufacturerLongitude
    );
  }
}
