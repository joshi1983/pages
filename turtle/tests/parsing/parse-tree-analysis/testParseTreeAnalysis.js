import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCachedParseTree } from './testCachedParseTree.js';
import { testCachedParseTreeGetPossibleTypesFromToken } from './testCachedParseTreeGetPossibleTypesFromToken.js';
import { testCachedParseTreeWithEvaluateTokensWithVariables } from './testCachedParseTreeWithEvaluateTokensWithVariables.js';
import { testCommandDataTypes } from './testCommandDataTypes.js';
import { testDenoising } from './denoising/testDenoising.js';
import { testDoesTokenAlwaysOutput } from './testDoesTokenAlwaysOutput.js';
import { testEvaluateToken } from './testEvaluateToken.js';
import { testForLoops } from './testForLoops.js';
import { testGetInstructionListChildToken } from './testGetInstructionListChildToken.js';
import { testGetOutputTypesForProcedure } from './testGetOutputTypesForProcedure.js';
import { testGetPossibleDataTypesEvaluatedFromToken } from './testGetPossibleDataTypesEvaluatedFromToken.js';
import { testGetPossibleDataTypesForVariableAtToken } from './testGetPossibleDataTypesForVariableAtToken.js';
import { testIsLoop } from './testIsLoop.js';
import { testIsUsingAnimationTime } from './testIsUsingAnimationTime.js';
import { testStringFormats } from './string-formats/testStringFormats.js';
import { testTipGenerators } from './tip-generators/testTipGenerators.js';
import { testValidateIdentifier } from './testValidateIdentifier.js';
import { testValidation } from './validation/testValidation.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';
import { testVariableScraper } from './testVariableScraper.js';
import { testWriteOptimizedCachedParseTree } from './testWriteOptimizedCachedParseTree.js';

export function testParseTreeAnalysis(logger) {
	function namedLog(prefix) {
		return prefixWrapper(prefix, logger);
	}
	testCachedParseTree(namedLog('testCachedParseTree'));
	testCachedParseTreeGetPossibleTypesFromToken(namedLog('testCachedParseTreeGetPossibleTypesFromToken'));
	testCachedParseTreeWithEvaluateTokensWithVariables(namedLog('testCachedParseTreeWithEvaluateTokensWithVariables'));
	testCommandDataTypes(namedLog('testCommandDataTypes'));
	testDoesTokenAlwaysOutput(namedLog('testDoesTokenAlwaysOutput'));
	testDenoising(namedLog('testDenoising'));
	testEvaluateToken(namedLog('testEvaluateToken'));
	testForLoops(namedLog('testForLoops'));
	testGetInstructionListChildToken(namedLog('testGetInstructionListChildToken'));
	testGetOutputTypesForProcedure(namedLog('testGetOutputTypesForProcedure'));
	testGetPossibleDataTypesEvaluatedFromToken(namedLog('testGetPossibleDataTypesEvaluatedFromToken'));
	testGetPossibleDataTypesForVariableAtToken(namedLog('testGetPossibleDataTypesForVariableAtToken'));
	testIsLoop(namedLog('testIsLoop'));
	testIsUsingAnimationTime(namedLog('testIsUsingAnimationTime'));
	testStringFormats(namedLog('testStringFormats'));
	testTipGenerators(namedLog('testTipGenerators'));
	testValidateIdentifier(namedLog('validateIdentifier'));
	testValidation(namedLog('testValidation'));
	testVariableDataTypes(namedLog('testVariableDataTypes'));
	testVariableScraper(namedLog('testVariableScraper'));
	testWriteOptimizedCachedParseTree(namedLog('testWriteOptimizedCachedParseTree'));
};