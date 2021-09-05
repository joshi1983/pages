import { testAnalyzeLengthForVariable } from './testAnalyzeLengthForVariable.js';
import { testGetIncrementAmountFromRepeat } from './testGetIncrementAmountFromRepeat.js'; 
import { testInterpretCommandCanBeInterpretted } from './testInterpretCommandCanBeInterpretted.js';
import { testMightAffectVariableLength } from './testMightAffectVariableLength.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testLengthEvaluationDirectory(logger) {
	wrapAndCall([
		testAnalyzeLengthForVariable,
		testGetIncrementAmountFromRepeat,
		testInterpretCommandCanBeInterpretted,
		testMightAffectVariableLength
	], logger);
};