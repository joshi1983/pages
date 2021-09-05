import { testGetAssetFileName } from './testGetAssetFileName.js';
import { testIsConvertToAssetApplicableToAnchorElement } from './testIsConvertToAssetApplicableToAnchorElement.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testConvertToAssetDirectory(logger) {
	wrapAndCall([
		testGetAssetFileName,
		testIsConvertToAssetApplicableToAnchorElement
	], logger);
};