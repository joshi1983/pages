import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testColourStringLiteralFixer } from './testColourStringLiteralFixer.js';
import { testCommaFixer } from './testCommaFixer.js';
import { testCommandTranslationFixer } from './testCommandTranslationFixer.js';
import { testErroneousSpacesFixer } from './testErroneousSpacesFixer.js';
import { testFilledFixer } from './testFilledFixer.js';
import { testForLoopVariableFixer } from './testForLoopVariableFixer.js';
import { testMissingSpacesFixer } from './testMissingSpacesFixer.js';
import { testProcedureInProcedureFixer } from './testProcedureInProcedureFixer.js';
import { testQuoteIntegerFixer } from './testQuoteIntegerFixer.js';

export function testFixers(logger) {
	testColourStringLiteralFixer(prefixWrapper('testColourStringLiteralFixer', logger));
	testCommaFixer(prefixWrapper('testCommaFixer', logger));
	testCommandTranslationFixer(prefixWrapper('testCommandTranslationFixer', logger));
	testErroneousSpacesFixer(prefixWrapper('testErroneousSpacesFixer', logger));
	testFilledFixer(prefixWrapper('testFilledFixer', logger));
	testForLoopVariableFixer(prefixWrapper('testForLoopVariableFixer', logger));
	testMissingSpacesFixer(prefixWrapper('testMissingSpacesFixer', logger));
	testProcedureInProcedureFixer(prefixWrapper('testProcedureInProcedureFixer', logger));
	testQuoteIntegerFixer(prefixWrapper('testQuoteIntegerFixer', logger));
};