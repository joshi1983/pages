import { testExecuteBinaryOperators } from './testExecuteBinaryOperators.js';
import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteIfStatements } from './testExecuteIfStatements.js';
import { testExecuteWhile } from './testExecuteWhile.js';
import { testTranslate } from
'./testTranslate.js';
import { testTranslateDoUntil } from './testTranslateDoUntil.js';
import { testTranslateDoWhile } from './testTranslateDoWhile.js';
import { testTranslateIfStatements } from './testTranslateIfStatements.js';
import { testTranslationToWebLogoExecutePrint } from
'./testTranslationToWebLogoExecutePrint.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
			testExecuteBinaryOperators,
			testExecuteDoWhile,
			testExecuteIfStatements,
			testExecuteWhile,
			testTranslate,
			testTranslateDoUntil,
			testTranslateDoWhile,
			testTranslateIfStatements,
			testTranslationToWebLogoExecutePrint,
			testTypeProcessors
		], logger);
};