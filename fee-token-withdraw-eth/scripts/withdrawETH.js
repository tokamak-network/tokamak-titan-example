import process from "process";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { predeploys } from "@tokamak-network/titan-contracts";

import l2StandardBridgeArtifact from "@tokamak-network/titan-contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json" assert { type: 'json' }
import l2StandardERC20 from "../artifacts/L2StandardERC20.sol/L2StandardERC20.json" assert { type: 'json' }

dotenv.config()

const l1Url = process.env.L1_URL || 'http://localhost:9545'
const l2Url = process.env.L2_URL || 'http://localhost:8545'
const balance = process.env.TEST_BALANCE || '0.001'
const key =
  process.env.PRIVATE_KEY ||
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const factory__L2StandardBridge = new ethers.ContractFactory(
  l2StandardBridgeArtifact.abi,
  l2StandardBridgeArtifact.bytecode
)

const factory__L2StandardERC20 = new ethers.ContractFactory(
  l2StandardERC20.abi,
  l2StandardERC20.bytecode
)

const main = async () => {
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)

  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  const L2Ton = factory__L2StandardERC20
  .attach(process.env.TON_CONTRACT_ADDRESS)
  .connect(l2Wallet)

  const getBalances = async () => {
    const l1Eth = ethers.utils.formatEther(
      await l1RpcProvider.getBalance(l1Wallet.address)
    )
    const l2Eth = ethers.utils.formatEther(
      await l2RpcProvider.getBalance(l2Wallet.address)
    )
    const l2Ton = ethers.utils.formatEther(
      await L2Ton.balanceOf(l2Wallet.address)
    )

    return [l1Eth, l2Eth, l2Ton]
  }

  const L2StandardBridge = factory__L2StandardBridge
    .connect(l2Wallet)
    .attach(predeploys.L2StandardBridge)
  const L1StandardBridgeAddress = await L2StandardBridge.l1TokenBridge()

  console.log(`L1Url: ${l1Url}`)
  console.log(`L2Url: ${l2Url}`)
  console.log(`L1StandardBridgeAddress: ${L1StandardBridgeAddress}`)
  console.log(`---------------- Widthdraw ${balance} ETH ----------------`);
  const balancesB4 = await getBalances()

  const tx = await L2StandardBridge.withdraw(
    predeploys.OVM_ETH,
    ethers.utils.parseEther(balance),
    0,
    '0xFFFF'
  )

  console.log(`TX Hash: ${tx.hash}`)

  const receipt = await tx.wait()
  if (receipt.status !== 1) {
    throw(new Error('transaction is failed'));
  }

  let balancesNow = await getBalances()
  console.log(
    `Before\tL1: ${balancesB4[0]} ETH \tL2: ${balancesB4[1]} ETH`)
  console.log(
    `Before\tL2: ${balancesB4[2]} TON`
  )  

  let seconds = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    seconds++
    balancesNow = await getBalances()
    if (balancesNow[0] === balancesB4[0]) {
      process.stdout.write(".")
    } else {
      console.log(
        `\nAfter ${seconds} second${seconds - 1 ? 's' : ''}`
      )
      console.log(
        `After \tL1: ${balancesNow[0]} ETH \tL2: ${balancesNow[1]} ETH`
      )
      console.log(
        `After\tL2: ${balancesNow[2]} TON`
      )  
      break;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
