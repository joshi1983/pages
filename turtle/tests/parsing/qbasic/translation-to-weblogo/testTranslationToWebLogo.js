import { testExecuteBinaryOperators } from './testExecuteBinaryOperators.js';
import { testExecuteCircle } from './testExecuteCircle.js';
import { testTranslateDataSections } from './testTranslateDataSections.js';
import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteIfStatements } from './testExecuteIfStatements.js';
import { testExecuteLine } from './testExecuteLine.js';
import { testExecutePSet } from './testExecutePSet.js';
import { testExecuteRead } from './testExecuteRead.js';
import { testExecuteWhile } from './testExecuteWhile.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateBadExamples } from './testTranslateBadExamples.js';
import { testTranslateContains } from './testTranslateContains.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateDoUntil } from './testTranslateDoUntil.js';
import { testTranslateDoUntilLoop } from './testTranslateDoUntilLoop.js';
import { testTranslateDoWhile } from './testTranslateDoWhile.js';
import { testTranslateFor } from './testTranslateFor.js';
import { testTranslateFunction } from './testTranslateFunction.js';
import { testTranslateGoto } from './testTranslateGoto.js';
import { testTranslateIfStatements } from './testTranslateIfStatements.js';
import { testTranslateInput } from './testTranslateInput.js';
import { testTranslateRead } from './testTranslateRead.js';
import { testTranslateSelect } from './testTranslateSelect.js';
import { testTranslateSub } from './testTranslateSub.js';
import { testTranslationToWebLogoExecutePrint } from
'./testTranslationToWebLogoExecutePrint.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
			testExecuteBinaryOperators,
			testExecuteCircle,
			testExecuteDoWhile,
			testExecuteIfStatements,
			testExecuteLine,
			testExecutePSet,
			testExecuteRead,
			testExecuteWhile,
			testTranslate,
			testTranslateBadExamples,
			testTranslateContains,
			testTranslateDataSections,
			testTranslateDef,
			testTranslateDoUntil,
			testTranslateDoUntilLoop,
			testTranslateDoWhile,
			testTranslateFor,
			testTranslateFunction,
			testTranslateGoto,
			testTranslateIfStatements,
			testTranslateInput,
			testTranslateRead,
			testTranslateSelect,
			testTranslateSub,
			testTranslationToWebLogoExecutePrint,
			testTypeProcessors
		], logger);
};