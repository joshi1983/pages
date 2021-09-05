import { testTranslateTurtleBlocksToWebLogo } from './testTranslateTurtleBlocksToWebLogo.js';
import { testTranslateTurtleBlocksToWebLogoWithVariousOperatorsAndCommands } from './testTranslateTurtleBlocksToWebLogoWithVariousOperatorsAndCommands.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateTurtleBlocksToWebLogo,
		testTranslateTurtleBlocksToWebLogoWithVariousOperatorsAndCommands
	], logger);
};