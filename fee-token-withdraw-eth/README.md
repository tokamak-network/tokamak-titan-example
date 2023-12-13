# Withdraw ETH with fee token

## Set the network
You must run the test network for testing the example code.
```sh
git clone -b feature/native-token --single-branch https://github.com/tokamak-network/tokamak-titan.git
cd tokamak-titan
# build
docker-compose -f ./ops/docker-compose-fee-token.yml build
# up
docker-compose -f ./ops/docker-compose-fee-token.yml up -d
# down
docker-compose -f ./ops/docker-compose-fee-token.yml down

```

## Editing .env

Copy `.env.example` file to `.env` and modify it. The sender must have some TON.

```sh
cp .env.example .env
<edit> .env
```

## Run test

**Install Packages**

```sh
yarn install
```

**Transfering ETH from L2 to L1**

```sh
yarn run withdraw
```

## Expected output

When running on the test network, the output from the script should be similar to:

```
---------------- Widthdraw 0.001 ETH ----------------
TX Hash: 0x8fcf24031721747f0fbd519a15b4f39dcac584000f1d1595e2c94b883402d2ed
Before  L1: 0.198185314318598221 ETH    L2: 0.061779738056659911 ETH
Before  L2: 5.3517209343875952 TON
.............
After 14 seconds
After   L1: 0.199185314318598221 ETH    L2: 0.060779738056659911 ETH
After   L2: 4.9270767220854416 TON


```