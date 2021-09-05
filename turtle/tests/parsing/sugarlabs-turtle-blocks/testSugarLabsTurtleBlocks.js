import { testBlock } from './testBlock.js';
import { testIsLikelyHTMLProjectExportFromSugarLabsTurtleBlocks } from
'./testIsLikelyHTMLProjectExportFromSugarLabsTurtleBlocks.js';
import { testIsLikelySugarLabsTurtleBlocks } from './testIsLikelySugarLabsTurtleBlocks.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSugarLabsTurtleBlocks(logger) {
	wrapAndCall([
		testBlock,
		testIsLikelyHTMLProjectExportFromSugarLabsTurtleBlocks,
		testIsLikelySugarLabsTurtleBlocks,
		testTranslationToWebLogo
	], logger);
};