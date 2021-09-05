import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGetBestCase } from './testGetBestCase.js';
import { testHarmonizeCommandNameCase } from './testHarmonizeCommandNameCase.js';
import { testHarmonizeKeywordCase } from './testHarmonizeKeywordCase.js';
import { testHarmonizeProcedureNameCase } from './testHarmonizeProcedureNameCase.js';
import { testHarmonizeVariableNameCase } from './testHarmonizeVariableNameCase.js';

export function testHarmonizeCaseDirectory(logger) {
	testGetBestCase(prefixWrapper('testGetBestCase', logger));
	testHarmonizeCommandNameCase(prefixWrapper('testHarmonizeCommandNameCase', logger));
	testHarmonizeKeywordCase(prefixWrapper('testHarmonizeKeywordCase', logger));
	testHarmonizeProcedureNameCase(prefixWrapper('testHarmonizeProcedureNameCase', logger));
	testHarmonizeVariableNameCase(prefixWrapper('testHarmonizeVariableNameCase', logger));
};