import { testGetBestCase } from './testGetBestCase.js';
import { testHarmonizeBooleanLiterals } from './testHarmonizeBooleanLiterals.js';
import { testHarmonizeCase } from './testHarmonizeCase.js';
import { testHarmonizeCommandNameCase } from './testHarmonizeCommandNameCase.js';
import { testHarmonizeKeywordCase } from './testHarmonizeKeywordCase.js';
import { testHarmonizeProcedureNameCase } from './testHarmonizeProcedureNameCase.js';
import { testHarmonizeVariableNameCase } from './testHarmonizeVariableNameCase.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testHarmonizeCaseDirectory(logger) {
	wrapAndCall([
		testGetBestCase,
		testHarmonizeBooleanLiterals,
		testHarmonizeCase,
		testHarmonizeCommandNameCase,
		testHarmonizeKeywordCase,
		testHarmonizeProcedureNameCase,
		testHarmonizeVariableNameCase
	], logger);
};