# Deposit and Withdraw ETH into Titan

## Editing .env

Copy `.env.example` file to `.env` and modify it.

```sh
cp .env.example .env

<edit> .env
```

## Run test

**Install Packages

```sh
yarn

or

yarn install
```

**Transfering ETH from L1 to L2**

```sh
yarn deposit
```

**Transfering ETH from L2 to L1**

```sh
yarn withdraw
```

## Expected output

When running on Goerli, the output from the script should be similar to:

**Transfering ETH from L1 to L2**
```sh
---------------- Deposit 0.001 ETH ----------------
TX Hash: 0x3a841ea3c3249978127ddfe71d206be94719811db735982c91b1f26d15d75d88
Before  L1:0.087099519208122815 L2:0.045706427572472572
After   L1:0.085888395702633604 L2:0.045706427572472572
..........
After 11 seconds        L1:0.085888395702633604 L2:0.046706427572472572
```

**Transfering ETH from L2 to L1**

```sh

---------------- Widthdraw 0.001 ETH ----------------
TX Hash: 0x669619343d9c29b62eca8b76c03fc53796b3c7e50c11cadbeabd8f9a19c7076f
Before  L1:0.085888395702633604 L2:0.045207719113742656
After   L1:0.085888395702633604 L2:0.04370901065501274
.............................................................................................................................................................................................................................................................................................................................................................
After 350 seconds       L1:0.057700735702633604 L2:0.04370901065501274

```

