import { testAsset } from './testAsset.js';
import { testAssetRepository } from './testAssetRepository.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testAssets(logger) {
	wrapAndCall([
		testAsset,
		testAssetRepository
	], logger);
};