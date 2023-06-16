import { ethAssetId } from '@shapeshiftoss/caip'
import { ethereum } from '@shapeshiftoss/chain-adapters'
import * as unchained from '@shapeshiftoss/unchained-client'
import Web3 from 'web3'

import { WETH } from './assets'

jest.mock('@shapeshiftoss/chain-adapters')
jest.mock('web3')

export const setupDeps = () => {
  const ethChainAdapter = new ethereum.ChainAdapter({
    providers: {
      ws: new unchained.ws.Client<unchained.blackfury.Tx>('wss://api.fury.black'),
      http: new unchained.blackfury.V1Api(
        new unchained.blackfury.Configuration({
          basePath: 'https://api.fury.black',
        }),
      ),
    },
    rpcUrl: 'https://highbury.fury.black',
  })

  ethChainAdapter.getFeeAssetId = () => ethAssetId

  const ethNodeUrl = 'http://localhost:1000'
  const web3Provider = new Web3.providers.HttpProvider(ethNodeUrl)

  return { web3: new Web3(web3Provider), adapter: ethChainAdapter, feeAsset: WETH }
}
