import { testAssetPasteListener } from './testAssetPasteListener.js';
import { testAssetViewers } from './asset-viewers/testAssetViewers.js';
import { testGetFilenameFromPath } from './testGetFilenameFromPath.js';
import { testIsTooLargeException } from './testIsTooLargeException.js';
import { testSanitizeAssetFilename } from './testSanitizeAssetFilename.js';
import { testSearchResults } from './testSearchResults.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testAssets(logger) {
	wrapAndCall([
		testAssetPasteListener,
		testAssetViewers,
		testGetFilenameFromPath,
		testIsTooLargeException,
		testSanitizeAssetFilename,
		testSearchResults
	], logger);
};