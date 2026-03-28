/*import { testExecArrayBuffer } from './testExecArrayBuffer.js';
import { testExecAssignment } from './testExecAssignment.js';
import { testExecDef } from './testExecDef.js';
import { testExecFor } from './testExecFor.js';
import { testExecIf } from './testExecIf.js';
import { testExecMath } from './testExecMath.js';
import { testExecRepeat } from './testExecRepeat.js';
import { testExecRepeatFor } from './testExecRepeatFor.js';
import { testExecWhile } from './testExecWhile.js';
import { testNeedsInitialPenColor } from
'./testNeedsInitialPenColor.js';
import { testReplaceCommandsToFitDataTypesFixer } from './testReplaceCommandsToFitDataTypesFixer.js';
*/import { testSimplifiers } from './simplifiers/testSimplifiers.js';
/*import { testTranslateColors } from './testTranslateColors.js';
import { testTranslateDef } from './testTranslateDef.js';
*/import { testTranslateFuncCalls } from './testTranslateFuncCalls.js';/*
import { testTranslateRepeatFor } from './testTranslateRepeatFor.js';
import { testTranslateToPolyStart } from './testTranslateToPolyStart.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';*/
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		/*testExecArrayBuffer,
		testExecAssignment,
		testExecDef,
		testExecFor,
		testExecIf,
		testExecMath,
		testExecRepeat,
		testExecRepeatFor,
		testExecWhile,
		testNeedsInitialPenColor,
		testReplaceCommandsToFitDataTypesFixer,*/
		testSimplifiers,/*
		testTranslateColors,
		testTranslateDef,
		*/testTranslateFuncCalls,/*
		testTranslateRepeatFor,
		testTranslateToPolyStart,
		testTranslateVariousExamples,
		testTypeProcessors*/
	], logger);
};