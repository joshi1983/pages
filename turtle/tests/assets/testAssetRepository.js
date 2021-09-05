import { Asset } from '../../modules/assets/Asset.js';
import { AssetRepository } from '../../modules/assets/AssetRepository.js';

export function testAssetRepository(logger) {
	const testFilename = 'asset-repository-test.dat';
	const didTestAssetExistBefore = AssetRepository.getAllFileNames().has(testFilename);
	const asset = AssetRepository.getOrCreateAssetByFilename(testFilename);
	if (!(asset instanceof Asset))
		logger('Asset expected but got: ' + asset);
	const assets = AssetRepository.getAssetsArray();
	if (!(assets instanceof Array))
		logger('Array expected from getAssetsArray() but got ' + assets);

	const allFilenames = AssetRepository.getAllFileNames();
	if (!(allFilenames instanceof Set))
		logger(`allFilenames expected to be a Set but got ${allFilenames}`);

	// Restore original state of the asset repository.
	if (!didTestAssetExistBefore)
		AssetRepository.remove(testFilename);
};