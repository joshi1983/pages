import { testBlock } from './testBlock.js';
import { testIsLikelySugarLabsTurtleBlocks } from './testIsLikelySugarLabsTurtleBlocks.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSugarLabsTurtleBlocks(logger) {
	wrapAndCall([
		testBlock,
		testIsLikelySugarLabsTurtleBlocks,
		testTranslationToWebLogo
	], logger);
};