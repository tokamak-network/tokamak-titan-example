# Bridging ETH with the Titan SDK

## Editing .env

Copy `.env.example` file to `.env` and modify it.

```sh
cp .env.example .env
<edit> .env
```

## Run test

**Install Packages**

```sh
yarn

or

yarn install
```

**Transfering ETH between L1 and L2**

```sh
node ./index.js
```

## Expected output

When running on Goerli, the output from the script should be similar to:

```
address:  0x961b6fb7D210298B88d7E4491E907cf09c9cD61d
Deposit ETH
On L1:950740134 Gwei    On L2:584201733 Gwei
Transaction hash (on L1): 0x03c94eff666a634eb5fe7dd60e35f1611d349ef59717e98d4ec42a6416cf6c8a
        For more information: https://goerli.etherscan.io/tx/0x03c94eff666a634eb5fe7dd60e35f1611d349ef59717e98d4ec42a6416cf6c8a
Waiting for status to change to RELAYED
Time so far 16.526 seconds
On L1:950528010 Gwei    On L2:584202733 Gwei
depositETH took 31.657 seconds


Withdraw ETH
On L1:950528010 Gwei    On L2:584202733 Gwei
Transaction hash (on L2): 0x5afb336f4d5ed0273c5b79f141a8c3104b37b74125968d72d1a2c0efcbe68714
        For more information: https://explorer.titan-goerli.tokamak.network/tx/0x5afb336f4d5ed0273c5b79f141a8c3104b37b74125968d72d1a2c0efcbe68714
In the challenge period, waiting for status READY_FOR_RELAY
Time so far 1.796 seconds
Ready for relay, finalizing message now
Time so far 163.372 seconds
Waiting for status to change to RELAYED
Time so far 174.011 seconds
On L1:949635465 Gwei    On L2:583720588 Gwei
withdrawETH took 195.921 seconds

```