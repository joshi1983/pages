import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGeneralAssetViewer } from './testGeneralAssetViewer.js';

export function testAssetViewers(logger) {
	testGeneralAssetViewer(prefixWrapper('testGeneralAssetViewer', logger));
};