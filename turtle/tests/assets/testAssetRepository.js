import { Asset } from '../../modules/assets/Asset.js';
import { AssetRepository } from '../../modules/assets/AssetRepository.js';

export function testAssetRepository(logger) {
	const asset = AssetRepository.getOrCreateAssetByFilename('asset-repository-test.dat');
	if (!(asset instanceof Asset))
		logger('Asset expected but got: ' + asset);
	const assets = AssetRepository.getAssetsArray();
	if (!(assets instanceof Array))
		logger('Array expected from getAssetsArray() but got ' + assets);
};