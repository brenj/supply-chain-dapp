pragma solidity ^0.4.24;

import "./Roles.sol";

contract CompanyRole {
    using Roles for Roles.Role;

    event CompanyAdded(address newCompany);
    event CompanyRemoved(address company);

    Roles.Role private companies;

    constructor() public {
        _addCompany(msg.sender);
    }

    modifier onlyCompany() {
        require(isCompany(msg.sender), 'Only a company can do this');
        _;
    }

    function isCompany(address account) public view returns (bool) {
        return companies.has(account);
    }

    function addCompany(address account) public onlyCompany {
        _addCompany(account);
    }

    function renounceCompany() public {
        _removeCompany(msg.sender);
    }

    function _addCompany(address account) internal {
        companies.add(account);
        emit CompanyAdded(account);
    }

    function _removeCompany(address account) internal {
        companies.remove(account);
        emit CompanyRemoved(account);
    }
}
