import { testExecArrayLiterals } from './testExecArrayLiterals.js';
import { testExecAssignments } from './testExecAssignments.js';
import { testExecFor } from './testExecFor.js';
import { testExecForWhile } from './testExecForWhile.js';
import { testExecFunc } from './testExecFunc.js';
import { testExecGoto } from './testExecGoto.js';
import { testExecGoTurtle } from './testExecGoTurtle.js';
import { testExecIf } from './testExecIf.js';
import { testExecTypeConversions } from './testExecTypeConversions.js';
import { testSimplifiers } from './simplifiers/testSimplifiers.js';
import { testTranslateArrays } from './testTranslateArrays.js';
import { testTranslateExecute } from './testTranslateExecute.js';
import { testTranslateExecuteOperators } from './testTranslateExecuteOperators.js';
import { testTranslateGoTurtleMethods } from './testTranslateGoTurtleMethods.js';
import { testTranslateGoTurtleProperties } from './testTranslateGoTurtleProperties.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecArrayLiterals,
		testExecAssignments,
		testExecFor,
		testExecForWhile,
		testExecFunc,
		testExecGoto,
		testExecGoTurtle,
		testExecIf,
		testExecTypeConversions,
		testSimplifiers,
		testTranslateArrays,
		testTranslateExecute,
		testTranslateExecuteOperators,
		testTranslateGoTurtleMethods,
		testTranslateGoTurtleProperties,
		testTranslateVariousExamples,
		testTypeProcessors
	], logger);
};