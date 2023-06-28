# Estimate the costs of an L2 transaction

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

**Estimate the gas in L2**

- `--network`: The network to estimate gas on:
  - `mainnet`: Titan Mainnet
  - `goerli`: Titan Goerli

- `--verify`: Run the transaction to verify the estimate

```sh
node ./gas.js --network <TARGET_NETWORK> --verify
```

## Expected output

Here is an example of results from Titan Goerli:


```sh
./gas.js --network goerli --verify
Greeter address: 0x4F0e20d3C62Ea59d6fcDCa51E9D0957a71b2EFa1
About to get estimates
About to create the transaction
Transaction created and submitted
Transaction processed
Estimates:
   Total gas cost:      460198882950367 wei
      L1 gas cost:      460190040950367 wei
      L2 gas cost:           8842000000 wei

Real values:
   Total gas cost:      460198879450368 wei
      L1 gas cost:      460190040950368 wei
      L2 gas cost:           8838500000 wei

L1 Gas:
      Estimate:       4926
          Real:       4926
    Difference:          0

L2 Gas:
      Estimate:      35368
          Real:      35354
    Difference:        -14
```