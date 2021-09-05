import { testExecuteBinaryOperators } from './testExecuteBinaryOperators.js';
import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteIfStatements } from './testExecuteIfStatements.js';
import { testExecuteWhile } from './testExecuteWhile.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateBadExamples } from './testTranslateBadExamples.js';
import { testTranslateDoUntil } from './testTranslateDoUntil.js';
import { testTranslateDoUntilLoop } from './testTranslateDoUntilLoop.js';
import { testTranslateDoWhile } from './testTranslateDoWhile.js';
import { testTranslateFor } from './testTranslateFor.js';
import { testTranslateGoto } from './testTranslateGoto.js';
import { testTranslateIfStatements } from './testTranslateIfStatements.js';
import { testExecutePSet } from './testExecutePSet.js';
import { testTranslateSelect } from
'./testTranslateSelect.js';
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
			testTranslateBadExamples,
			testTranslateDoUntil,
			testTranslateDoUntilLoop,
			testTranslateDoWhile,
			testTranslateFor,
			testTranslateGoto,
			testTranslateIfStatements,
			testExecutePSet,
			testTranslateSelect,
			testTranslationToWebLogoExecutePrint,
			testTypeProcessors
		], logger);
};