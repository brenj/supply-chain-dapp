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
    require(msg.value >= _price, 'Not Paid Enough');
    _;
  }
  
  modifier checkValue(string _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    items[_upc].consumerID.transfer(amountToReturn);
  }

  modifier designed(string _upc) {
    require(items[_upc].itemState == State.Designed);
    _;
  }

  modifier manufactured(string _upc) {
    require(items[_upc].itemState == State.Manufactured);
    _;
  }
  
  modifier packaged(string _upc) {
    require(items[_upc].itemState == State.Packaged);
    _;
  }

  modifier forSale(string _upc) {
    require(items[_upc].itemState == State.ForSale);
    _;
  }

  modifier sold(string _upc) {
    require(items[_upc].itemState == State.Sold);
    _;
  }
  
  modifier shipped(string _upc) {
    require(items[_upc].itemState == State.Shipped);
    _;
  }

  modifier received(string _upc) {
    require(items[_upc].itemState == State.Received);
    _;
  }

  modifier stocked(string _upc) {
    require(items[_upc].itemState == State.Stocked);
    _;
  }

  modifier purchased(string _upc) {
    require(items[_upc].itemState == State.Purchased);
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
    product.sku = _sku;
    product.companyID = _companyID;
    product.productID = _productID;
    product.productNotes = _productNotes;
    product.productPrice = _productPrice;

    items[_upc] = product;
    emit Designed(_upc);
  }

  function manufactureToy(
      string _upc,
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

  function packageToy(string _upc) public onlyManufacturer manufactured(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Packaged;
    emit Packaged(_upc);
  }

  function sellToy(string _upc) public onlyManufacturer packaged(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.ForSale;
    emit ForSale(_upc);
  }

  function buyToy(string _upc, address _retailerID, uint _price)
    public
    onlyRetailer
    forSale(_upc)
    payable
    paidEnough(_price)
    checkValue(_upc)
  {
    Item storage product = items[_upc];

    // Store product owner before it's updated
    address productOwner = product.ownerID;

    product.ownerID = _retailerID;
    product.retailerID = _retailerID;
    product.itemState = State.Sold;

    productOwner.transfer(_price);

    emit Sold(_upc);
  }

  function shipToy(string _upc) public onlyManufacturer sold(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Shipped;
    emit Shipped(_upc);
  }

  function receiveToy(string _upc) public onlyRetailer shipped(_upc) {
    Item storage product = items[_upc];
    product.productPrice = product.productPrice * 2;
    product.itemState = State.Received;
    emit Received(_upc);
  }

  function stockToy(string _upc) public onlyRetailer received(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Stocked;
    emit Stocked(_upc);
  }

  function purchaseToy(string _upc, address _consumerID, uint _price)
    public
    onlyConsumer
    stocked(_upc)
    payable
    paidEnough(_price)
    checkValue(_upc)
  {
    Item storage product = items[_upc];

    // Store product owner before it's updated
    address productOwner = product.ownerID;

    product.ownerID = _consumerID;
    product.itemState = State.Purchased;

    productOwner.transfer(_price);

    emit Purchased(_upc);
  }

  function fetchState(string _upc) public view returns (State) {
    Item memory product = items[_upc];
    return product.itemState;
  }

  function fetchProductData(string _upc)
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

  function fetchManufacturerData(string _upc)
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
}
