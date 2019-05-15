pragma solidity ^0.4.24;

import "./Roles.sol";

contract ConsumerRole {
    using Roles for Roles.Role;

    event ConsumerAdded(address newConsumer);
    event ConsumerRemoved(address consumer);

    Roles.Role private consumers;

    constructor() public {
        _addConsumer(msg.sender);
    }

    modifier onlyConsumer() {
        require(
            isConsumer(msg.sender), 'Only a consumer can do this');
        _;
    }

    function isConsumer(address account) public view returns (bool) {
        return consumers.has(account);
    }

    function addConsumer(address account) public onlyConsumer {
        _addConsumer(account);
    }

    function renounceConsumer() public {
        _removeConsumer(msg.sender);
    }

    function _addConsumer(address account) internal {
        consumers.add(account);
        emit ConsumerAdded(account);
    }

    function _removeConsumer(address account) internal {
        consumers.remove(account);
        emit ConsumerRemoved(account);
    }
}
