import { testTranslateTurtleBlocksToWebLogo } from './testTranslateTurtleBlocksToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateTurtleBlocksToWebLogo
	], logger);
};