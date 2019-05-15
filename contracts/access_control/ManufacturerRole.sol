pragma solidity ^0.4.24;

import "./Roles.sol";

contract ManufacturerRole {
    using Roles for Roles.Role;

    event ManufacturerAdded(address newManufacturer);
    event ManufacturerRemoved(address manufacturer);

    Roles.Role private manufacturers;

    constructor() public {
        _addManufacturer(msg.sender);
    }

    modifier onlyManufacturer() {
        require(
            isManufacturer(msg.sender), 'Only a manufacturer can do this');
        _;
    }

    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    function addManufacturer(address account) public onlyManufacturer {
        _addManufacturer(account);
    }

    function renounceManufacturer() public {
        _removeManufacturer(msg.sender);
    }

    function _addManufacturer(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }

    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account);
    }
}
