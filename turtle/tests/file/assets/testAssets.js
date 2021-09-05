import { testAssetPasteListener } from './testAssetPasteListener.js';
import { testAssetViewers } from './asset-viewers/testAssetViewers.js';
import { testGetFilenameFromPath } from './testGetFilenameFromPath.js';
import { testGetImageAssetCode } from './testGetImageAssetCode.js';
import { testImageAssetToDimensions } from './testImageAssetToDimensions.js';
import { testIsTooLargeException } from './testIsTooLargeException.js';
import { testSanitizeAssetFilename } from './testSanitizeAssetFilename.js';
import { testSearchResults } from './testSearchResults.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testAssets(logger) {
	wrapAndCall([
		testAssetPasteListener,
		testAssetViewers,
		testGetFilenameFromPath,
		testGetImageAssetCode,
		testImageAssetToDimensions,
		testIsTooLargeException,
		testSanitizeAssetFilename,
		testSearchResults
	], logger);
};