import { testExecLet } from './testExecLet.js';
import { testExecSet } from './testExecSet.js';
import { testExecSubroutine } from './testExecSubroutine.js';
import { testExecType } from './testExecType.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecLet,
		testExecSet,
		testExecSubroutine,
		testExecType,
		testTranslateVariousExamples
	], logger);
};