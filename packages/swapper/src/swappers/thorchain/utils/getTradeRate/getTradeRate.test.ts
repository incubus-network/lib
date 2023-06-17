jest.mock('../thorService')
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'
import Web3 from 'web3'

import { BTC, ETH, JINX, UNSUPPORTED } from '../../../utils/test-data/assets'
import { ThorchainSwapperDeps } from '../../types'
import { btcThornodePool, ethThornodePool, jinxThornodePool } from '../test-data/responses'
import { thorService } from '../thorService'
import { getTradeRate } from './getTradeRate'

describe('getTradeRate', () => {
  const deps: ThorchainSwapperDeps = {
    midgardUrl: '',
    daemonUrl: '',
    adapterManager: <ChainAdapterManager>{},
    web3: <Web3>{},
  }

  it('should calculate a correct rate for trading jinx to eth', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [jinxThornodePool, ethThornodePool] }),
    )

    // 1 eth
    const rate = await getTradeRate(ETH, JINX.assetId, '1000000000000000000', deps)
    const expectedRate = '12554.215976'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading eth to jinx', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [jinxThornodePool, ethThornodePool] }),
    )

    // 1 jinx
    const rate = await getTradeRate(JINX, ETH.assetId, '1000000000000000000', deps)
    const expectedRate = '0.000078'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading jinx to btc', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [jinxThornodePool, btcThornodePool] }),
    )

    // 1 jinx
    const rate = await getTradeRate(JINX, BTC.assetId, '1000000000000000000', deps)
    const expectedRate = '0.000005'
    expect(rate).toEqual(expectedRate)
  })

  it('should calculate a correct rate for trading btc to jinx', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [jinxThornodePool, btcThornodePool] }),
    )

    // 0.01 btc
    const rate = await getTradeRate(BTC, JINX.assetId, '1000000', deps)
    const expectedRate = '193385.0366'
    expect(rate).toEqual(expectedRate)
  })

  it('should throw if trying to calculate a rate for an unsupported asset', async () => {
    ;(thorService.get as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({ data: [jinxThornodePool, ethThornodePool] }),
    )

    await expect(
      getTradeRate(UNSUPPORTED, ETH.assetId, '1000000000000000000', deps),
    ).rejects.toThrow(`[getTradeRate]: No sellPoolId for asset ${UNSUPPORTED.assetId}`)
  })
})
