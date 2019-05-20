ToyChain
========

![toychain](screenshots/toychain.png?raw=true)

About
-----

Project:
`Ethereum Dapp for Tracking Toys through Supply Chain`

From Udacity:
> Learn how to manage and audit blockchain product ownership as the product is transferred down the supply chain. Improve your notarization service with a smart contract to support transferring of ownership, product auditing, and supply chain management.

Supporting courses:
* Architecture

`ToyChain` is a decentralized application used to track toys through the supply chain; from design to consumer purchase. A Toy and Board Game company like Hasbro was what I had in mind when developing this example Dapp, however it's generic enough to be applied to other industries as well. Typically there would be a distributor in between the manufacturer and retailer, but for simplicity I make the assumption that the manufacturer can also sell and ship to retailers.

UML Diagrams
------------
* [Activity]()
* [Sequence]()
* [State]()
* [Data Model (Class)]()

Deployment to Rinkeby
---------------------
```console
$> truffle migrate --reset --network rinkeby
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0xfe251985cceae4ef6672d027004f8d13529f93e153da82ae66c00c184d7d9591
  Migrations: 0xc016a3face3aee926613c07a6a7eb9a0736d3b94
Saving successful migration to network...
  ... 0xeeaeef14e6cb69e5da3f1e4b88ce9ea8a551c81c2717498e4d7704f8bb4d9d6b
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing SupplyChain...
  ... 0x28c096ea2a24f6256c1649d11cd50d10d79005561929ccadddca268ecb439443
  SupplyChain: 0x4bd3f18ef05c4d1f74cbb604620ccb54bcf020f4
Saving successful migration to network...
  ... 0xd0140d165399cf348f45084ac0c9b7cffb36ee4526df32ad04f637bd50d35379
Saving artifacts...

$> truffle networks

Network: rinkeby (id: 4)
  CompanyRole: 0x43fb35ae4b836c5017f85f5234846a77fce57067
  ConsumerRole: 0x707fccf6ebb9c690e2ee1a29ef5aa807a1732cc9
  ManufacturerRole: 0x8de69084ff86a3c9b799cdc33feae7458f826c5a
  Migrations: 0xc016a3face3aee926613c07a6a7eb9a0736d3b94
  RetailerRole: 0x6737f436ee8701f96117ca97c6e3ba4047f9674a
  SupplyChain: 0x4bd3f18ef05c4d1f74cbb604620ccb54bcf020f4
```

Requirements
------------
* Node
* Node Package Manager (npm)
* Truffle
* Ganache
* Infura

Install & Run
-------------
1. `npm install`
2. `truffle test`
3. `npm run web`

Screenshot
----------
![toychain_transactions](screenshots/toychain_transactions.png?raw=true)

Code Organization
-----------------
```console
contracts/
├── Migrations.sol
├── access_control
│   ├── CompanyRole.sol
│   ├── ConsumerRole.sol
│   ├── ManufacturerRole.sol
│   ├── RetailerRole.sol
│   └── Roles.sol
├── base
│   └── SupplyChain.sol
└── core
    └── Ownable.sol

test/
├── TestCompanyRole.js
├── TestConsumerRole.js
├── TestManufacturerRole.js
├── TestRetailerRole.js
└── TestSupplychain.js

web/
├── css
│   └── style.css
├── images
│   ├── ethereum.png
├── index.html
└── js
    ├── app.js
    └── truffle-contract.js
```

Grading (by Udacity)
--------------------

Criteria                  |Highest Grade Possible  |Grade Recieved
--------------------------|------------------------|--------------------
Write Up                  |Meets Specifications    |Meets Specifications
Write Smart Contracts     |Meets Specifications    |Meets Specifications
Test Smart Contract       |Meets Specifications    |Meets Specifications
Deploy Smart Contract     |Meets Specifications    |Meets Specifications
Modify Client Code        |Meets Specifications    |Meets Specifications
