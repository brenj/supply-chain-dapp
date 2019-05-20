ToyChain
========

![toychain](screenshots/toychain.png?raw=true)

About
-----

Project:  
`Ethereum Dapp for Tracking Items through Supply Chain`

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
$> truffle migrate --network rinkeby
Using network 'rinkeby'.                                                 
                                    
Running migration: 1_initial_migration.js                                
  Deploying Migrations...           
  ... 0xb36330460c27d1ab9691e725a4144a32d5e3948acb06eae54b26b3805e57925d 
  Migrations: 0x701bc8773b136d3d63c891a18fdbd60c461e349b
Saving successful migration to network...
  ... 0xf6469f5c2efd86b1c9309a71a27b0b69c1079df992e5bdbf261e2772cdef5a98
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing CompanyRole...
  ... 0x98c52dea28608f592e9ef37423e2a61b52df3c73439f243620be395c911dee72
  CompanyRole: 0x43fb35ae4b836c5017f85f5234846a77fce57067
  Replacing ManufacturerRole...
  ... 0x5a7e76640909724022124ba1e73605f716346d79cc572c57a042762f2c7e92f4
  ManufacturerRole: 0x8de69084ff86a3c9b799cdc33feae7458f826c5a
  Replacing RetailerRole...
  ... 0x5cdfba9acb84ee3ff3729df139b0b702302ce042f75fde829515b75766361241
  RetailerRole: 0x6737f436ee8701f96117ca97c6e3ba4047f9674a
  Replacing ConsumerRole...
  ... 0xca4f55ac81d2da1b7c88257967ec317d7b40957b4021e1090495138e292e2193
  ConsumerRole: 0x707fccf6ebb9c690e2ee1a29ef5aa807a1732cc9
  Replacing SupplyChain...
  ... 0x12e5e50f1639c9cfeb37db44e4a5c57b9b0aa363831c0446a9b1e6d1c4161ffb
  SupplyChain: 0x85d20d4bfb2ec672df87272fcb284c8113f75670
Saving successful migration to network...
  ... 0xec41215bb5e415b94c75345dad0ed22cefdc06b5334207145492b744a8ae3ab1
Saving artifacts...

$> truffle networks

Network: rinkeby (id: 4)
  CompanyRole: 0x43fb35ae4b836c5017f85f5234846a77fce57067
  ConsumerRole: 0x707fccf6ebb9c690e2ee1a29ef5aa807a1732cc9
  ManufacturerRole: 0x8de69084ff86a3c9b799cdc33feae7458f826c5a
  Migrations: 0x701bc8773b136d3d63c891a18fdbd60c461e349b
  RetailerRole: 0x6737f436ee8701f96117ca97c6e3ba4047f9674a
  SupplyChain: 0x85d20d4bfb2ec672df87272fcb284c8113f75670
```

Requirements
------------
* Node
* Node Package Manager (npm)

Development Requirements
------------------------
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
Write Up                  |Meets Specifications    |
Write Smart Contracts     |Meets Specifications    |
Test Smart Contract       |Meets Specifications    |
Deploy Smart Contract     |Meets Specifications    |
Modify Client Code        |Meets Specifications    |
