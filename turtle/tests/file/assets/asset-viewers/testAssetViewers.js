import { testGeneralAssetViewer } from './testGeneralAssetViewer.js';
import { testImageAssetViewer } from
'./testImageAssetViewer.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAssetViewers(logger) {
	wrapAndCall([
		testGeneralAssetViewer,
		testImageAssetViewer
	], logger);
};