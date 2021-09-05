import { testGeneralAssetViewer } from './testGeneralAssetViewer.js';
import { testImageAssetViewer } from
'./testImageAssetViewer.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAssetViewers(logger) {
	return wrapAndCall([
		testGeneralAssetViewer,
		testImageAssetViewer
	], logger);
};