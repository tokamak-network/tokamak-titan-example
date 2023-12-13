const { ethers, utils, BigNumber } = require('ethers');
require('dotenv').config()

const provider = new ethers.providers.JsonRpcProvider(process.env.L2_NODE_WEB3_URL);
const wallet = new ethers.Wallet(process.env.PRIV_KEY, provider);

// load TON_FeeVault contract
const TonFeeVaultArtifact = require('./artifacts/TON_FeeVault.sol/TON_FeeVault.json')
const factory__TonFeeVault = new ethers.ContractFactory(
  TonFeeVaultArtifact.abi,
  TonFeeVaultArtifact.bytecode
)
const Ton_FeeVault = factory__TonFeeVault
  .attach(process.env.TON_FEE_VAULT_CONTRACT_ADDRESS)
  .connect(wallet)

// load L2Ton contract
const l2StandardERC20 = require('./artifacts/L2StandardERC20.sol/L2StandardERC20.json')
const factory__L2StandardERC20 = new ethers.ContractFactory(
  l2StandardERC20.abi,
  l2StandardERC20.bytecode
)
const L2Ton = factory__L2StandardERC20
  .attach(process.env.TON_CONTRACT_ADDRESS)
  .connect(wallet)

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendTON() {

  console.log('[sendTON] sender: ', wallet.address)
  // send 1 TON
  const toAddress = '0x0c6FeBDf976Bc316D7bA0D3c014BC338714476dB'
  const amount = utils.parseEther('1')
  const balanceETHBefore = await wallet.getBalance()
  const balanceTONBefore = await L2Ton.balanceOf(wallet.address)

  console.log(utils.formatEther(balanceETHBefore), utils.formatEther(balanceTONBefore))

  // transfer TON
  const tx = await L2Ton.transfer(toAddress, amount)
  console.log('Transaction hash:', tx.hash);
  const receipt = await tx.wait()

  await sleep(3000)

  if (receipt.status === 1) {
    const json = await provider.send('eth_getTransactionReceipt', [
      tx.hash,
    ])
    const balanceETHAfter = await wallet.getBalance()
    const balanceTONAfter = await L2Ton.balanceOf(wallet.address)

    const usedETH = balanceETHBefore.sub(balanceETHAfter)
    const usedTON = balanceTONBefore.sub(balanceTONAfter)
    console.log('Change in ETH balance: ', utils.formatEther(usedETH))
    console.log('change in TON balance: ', utils.formatEther(usedTON))
    const priceRatio = await Ton_FeeVault.priceRatio()
    l1Fee = BigNumber.from(json.l1Fee).mul(priceRatio)
    l2Fee = receipt.gasUsed.mul(tx.gasPrice).mul(priceRatio)
    totalFee = l1Fee.add(l2Fee)
    console.log('L1Fee: ', utils.formatEther(l1Fee))
    console.log('L2Fee: ', utils.formatEther(l2Fee))
    console.log('Total Fee: ', utils.formatEther(totalFee))
  }
}


sendTON()