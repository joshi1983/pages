import { testGeneralAssetViewer } from './testGeneralAssetViewer.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAssetViewers(logger) {
	wrapAndCall([
		testGeneralAssetViewer
	], logger);
};