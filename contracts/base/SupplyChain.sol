pragma solidity ^0.4.24;

import '../access_control/CompanyRole.sol';
import '../access_control/ManufacturerRole.sol';
import '../access_control/RetailerRole.sol';
import '../access_control/ConsumerRole.sol';
import '../core/Ownable.sol';

contract SupplyChain is Ownable, CompanyRole, ManufacturerRole, RetailerRole, ConsumerRole {

  uint sku;
  uint upc;

  // upc -> Item
  mapping (uint => Item) items;

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

  modifier stocked(uint _upc) {
    require(items[_upc].itemState == State.Stocked);
    _;
  }

  modifier purchased(uint _upc) {
    require(items[_upc].itemState == State.Purchased);
    _;
  }

  constructor() public payable {
    sku = 1;
    upc = 1;
  }

  function kill() public onlyOwner {
    selfdestruct(owner());
  }

  function designToy(
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

  function manufactureToy(
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

  function packageToy(uint _upc) public onlyManufacturer manufactured(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Packaged;
    emit Packaged(_upc);
  }

  function sellToy(uint _upc) public onlyManufacturer packaged(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.ForSale;
    emit ForSale(_upc);
  }

  function buyToy(uint _upc, address _retailerID, uint _price)
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

  function shipToy(uint _upc) public onlyManufacturer sold(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Shipped;
    emit Shipped(_upc);
  }

  function receiveToy(uint _upc) public onlyRetailer shipped(_upc) {
    Item storage product = items[_upc];
    product.productPrice = product.productPrice * 2;
    product.itemState = State.Received;
    emit Received(_upc);
  }

  function stockToy(uint _upc) public onlyRetailer received(_upc) {
    Item storage product = items[_upc];
    product.itemState = State.Stocked;
    emit Stocked(_upc);
  }

  function purchaseToy(uint _upc, address _consumerID, uint _price)
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
}
