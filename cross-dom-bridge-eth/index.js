#! /usr/local/bin/node

// Transfers between L1 and L2 using the Titan SDK

const ethers = require("ethers")
const titanSDK = require("@tokamak-network/titan-sdk")
require('dotenv').config()

const l1Url = process.env.L1_URL
const l2Url = process.env.L2_URL
const privateKey = process.env.PRIVATE_KEY

// Global variable because we need them almost everywhere
let crossChainMessenger
let addr

// Check if the private key has '0x' prefix
const addHexPrefix = (privateKey) => {
  if (privateKey.substring(0, 2) !== "0x") {
    privateKey = "0x" + privateKey
  }
  return privateKey
}

// Get the signers
const getSigners = async () => {
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)
    const l1Wallet = new ethers.Wallet(addHexPrefix(privateKey), l1RpcProvider)
    const l2Wallet = new ethers.Wallet(addHexPrefix(privateKey), l2RpcProvider)

    return [l1Wallet, l2Wallet]
}

// Setup
const setup = async() => {
  const [l1Signer, l2Signer] = await getSigners()
  addr = l1Signer.address
  console.log('address: ', addr)
  crossChainMessenger = new titanSDK.BatchCrossChainMessenger({
      l1ChainId: 5,    // Goerli value, 1 for mainnet
      l2ChainId: 5050,  // Goerli value, 55004 for mainnet
      l1SignerOrProvider: l1Signer,
      l2SignerOrProvider: l2Signer,
  })
}

const gwei = BigInt(1e9)

// Report the L1, L2 balance
const reportBalances = async () => {
  const l1Balance = (await crossChainMessenger.l1Signer.getBalance()).toString().slice(0,-9)
  const l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString().slice(0,-9)

  console.log(`On L1:${l1Balance} Gwei    On L2:${l2Balance} Gwei`)
}

// deposit ETH
const depositETH = async () => {

  console.log("Deposit ETH")
  await reportBalances()
  const start = new Date()

  // 0.000001 ETH
  const response = await crossChainMessenger.depositETH(1000n * gwei)
  console.log(`Transaction hash (on L1): ${response.hash}`)
  console.log(`\tFor more information: https://goerli.etherscan.io/tx/${response.hash}`)
  await response.wait()

  console.log("Waiting for status to change to RELAYED")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response,
                                                  titanSDK.MessageStatus.RELAYED)

  await reportBalances()
  console.log(`depositETH took ${(new Date()-start)/1000} seconds\n\n`)
}

// withdraw ETH
const withdrawETH = async () => {

  console.log("Withdraw ETH")
  const start = new Date()
  await reportBalances()

  // 0.000001 ETH
  const response = await crossChainMessenger.withdrawETH(1000n * gwei)
  console.log(`Transaction hash (on L2): ${response.hash}`)
  console.log(`\tFor more information: https://explorer.titan-goerli.tokamak.network/tx/${response.hash}`)
  await response.wait()

  console.log("In the challenge period, waiting for status READY_FOR_RELAY")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)

  await crossChainMessenger.waitForMessageStatus(response,
                                                titanSDK.MessageStatus.READY_FOR_RELAY)
  console.log("Ready for relay, finalizing message now")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)

  await crossChainMessenger.finalizeBatchMessage([response])

  console.log("Waiting for status to change to RELAYED")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response,
    titanSDK.MessageStatus.RELAYED)

  await reportBalances()
  console.log(`withdrawETH took ${(new Date()-start)/1000} seconds\n\n\n`)
}

// main
const main = async () => {
    await setup()
    await depositETH()
    await withdrawETH()
}

main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })





