/*import { testExecArrayBuffer } from './testExecArrayBuffer.js';
import { testExecAssignment } from './testExecAssignment.js';
import { testExecDef } from './testExecDef.js';
import { testExecIf } from './testExecIf.js';
import { testExecMath } from './testExecMath.js';
import { testExecRepeat } from './testExecRepeat.js';
import { testReplaceCommandsToFitDataTypesFixer } from './testReplaceCommandsToFitDataTypesFixer.js';
import { testSimplifiers } from './simplifiers/testSimplifiers.js';
import { testTranslateColors } from './testTranslateColors.js';
*/import { testTranslateDef } from './testTranslateDef.js';
/*import { testTranslateFuncCalls } from './testTranslateFuncCalls.js';
import { testTranslateRepeatFor } from './testTranslateRepeatFor.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
*/import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		/*testExecArrayBuffer,
		testExecAssignment,
		testExecDef,
		testExecIf,
		testExecMath,
		testExecRepeat,
		testReplaceCommandsToFitDataTypesFixer,
		testSimplifiers,
		testTranslateColors,*/
		testTranslateDef,/*
		testTranslateFuncCalls,
		testTranslateRepeatFor,
		testTranslateVariousExamples*/
	], logger);
};