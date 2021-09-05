import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testAnalyzeLengthForVariable } from './testAnalyzeLengthForVariable.js';
import { testInterpretCommandCanBeInterpretted } from './testInterpretCommandCanBeInterpretted.js';
import { testMightAffectVariableLength } from './testMightAffectVariableLength.js';

export function testLengthEvaluationDirectory(logger) {
	testAnalyzeLengthForVariable(prefixWrapper('testAnalyzeLengthForVariable', logger));
	testInterpretCommandCanBeInterpretted(prefixWrapper('testInterpretCommandCanBeInterpretted', logger));
	testMightAffectVariableLength(prefixWrapper('testMightAffectVariableLength', logger));
};