import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testAssetViewers } from './asset-viewers/testAssetViewers.js';
import { testGetFilenameFromPath } from './testGetFilenameFromPath.js';
import { testSanitizeAssetFilename } from './testSanitizeAssetFilename.js';
import { testSearchResults } from './testSearchResults.js';

export function testAssets(logger) {
	testAssetViewers(prefixWrapper('testAssetViewers', logger));
	testGetFilenameFromPath(prefixWrapper('testGetFilenameFromPath', logger));
	testSanitizeAssetFilename(prefixWrapper('testSanitizeAssetFilename', logger));
	testSearchResults(prefixWrapper('testSearchResults', logger));
};