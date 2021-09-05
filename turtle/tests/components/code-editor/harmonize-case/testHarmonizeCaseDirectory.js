import { testGetBestCase } from './testGetBestCase.js';
import { testHarmonizeCommandNameCase } from './testHarmonizeCommandNameCase.js';
import { testHarmonizeKeywordCase } from './testHarmonizeKeywordCase.js';
import { testHarmonizeProcedureNameCase } from './testHarmonizeProcedureNameCase.js';
import { testHarmonizeVariableNameCase } from './testHarmonizeVariableNameCase.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testHarmonizeCaseDirectory(logger) {
	wrapAndCall([
		testGetBestCase,
		testHarmonizeCommandNameCase,
		testHarmonizeKeywordCase,
		testHarmonizeProcedureNameCase,
		testHarmonizeVariableNameCase
	], logger);
};