import { testConvertToAssetDirectory } from './convert-to-asset/testConvertToAssetDirectory.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testContextMenuDirectory(logger) {
	wrapAndCall([
		testConvertToAssetDirectory
	], logger);
};