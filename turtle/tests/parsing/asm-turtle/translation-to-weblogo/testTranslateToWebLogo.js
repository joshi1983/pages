import { testJumpConversion } from './jump-conversion/testJumpConversion.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateExamples } from './testTranslateExamples.js';
import { testTranslateSetColor } from './testTranslateSetColor.js';
import { testTranslateToDoWhile } from './testTranslateToDoWhile.js';
import { testTranslateToForever } from './testTranslateToForever.js';
import { testTranslateToIf } from './testTranslateToIf.js';
import { testTranslateToIfelse } from './testTranslateToIfelse.js';
import { testTranslateToWhile } from './testTranslateToWhile.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslateToWebLogo(logger) {
	wrapAndCall([
		testJumpConversion,
		testTranslate,
		testTranslateToDoWhile,
		testTranslateExamples,
		testTranslateSetColor,
		testTranslateToForever,
		testTranslateToIf,
		testTranslateToIfelse,
		testTranslateToWhile
	], logger);
};