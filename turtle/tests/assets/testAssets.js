import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testAsset } from './testAsset.js';
import { testAssetRepository } from './testAssetRepository.js';

export function testAssets(logger) {
	testAsset(prefixWrapper('testAsset', logger));
	testAssetRepository(prefixWrapper('testAssetRepository', logger));
};