# Transfer ETH/TON with fee token

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

Copy `.env.example` file to `.env` and modify it. The sender must have some ETH and TON.

```sh
cp .env.example .env
<edit> .env
```

## Run test

**Install Packages**

```sh
npm install
```

**Transfering ETH in L2**

```sh
npm run eth
```

## Expected output

When running on the test network, the output from the script should be similar to:

```
Transaction hash: 0x2e16d471c56564b631fcb0b9ab6106628a1ff3a7d1ff8a1b9c504675accfbcfa
Change in ETH balance:  0.001
change in TON balance:  0.3537894186506904
L1Fee:  0.3537891592754904
L2Fee:  0.0000002593752
Total Fee:  0.3537894186506904

```


**Transfering TON in L2**

```sh
npm run ton
```

## Expected output

When running on the test network, the output from the script should be similar to:

```
Transaction hash: 0xca355143a677a194476da1d56250ae5a6c6d46bf49496c0a6f13906910c00b43
Change in ETH balance:  0.0
change in TON balance:  1.3987911467022376
L1Fee:  0.3987907573430088
L2Fee:  0.0000003893592288
Total Fee:  0.3987911467022376

```



