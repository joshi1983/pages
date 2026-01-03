/*import { testCachedParseTree } from './testCachedParseTree.js';
import { testCachedParseTreeDirectory } from './cached-parse-tree/testCachedParseTreeDirectory.js';
import { testCachedParseTreeGetLengthFromToken } from './testCachedParseTreeGetLengthFromToken.js';
*/import { testCachedParseTreeGetPossibleTypesFromToken } from './testCachedParseTreeGetPossibleTypesFromToken.js';
/*import { testCachedParseTreeGetPossibleTypesFromTokenCurvedBrackets } from './testCachedParseTreeGetPossibleTypesFromTokenCurvedBrackets.js';
import { testCachedParseTreeWithEvaluateTokensWithVariables } from './testCachedParseTreeWithEvaluateTokensWithVariables.js';
import { testCommandDataTypes } from './testCommandDataTypes.js';
import { testCommandDataTypesDirectory } from './command-data-types/testCommandDataTypesDirectory.js';
import { testDenoising } from './denoising/testDenoising.js';
import { testDoesTokenAlwaysOutput } from './testDoesTokenAlwaysOutput.js';
import { testEvaluateStringLiteralVal } from './testEvaluateStringLiteralVal.js';
import { testEvaluateToken } from './testEvaluateToken.js';
import { testForLoops } from './testForLoops.js';
import { testGetInstructionListChildToken } from './testGetInstructionListChildToken.js';
import { testGetOutputTypesForProcedure } from './testGetOutputTypesForProcedure.js';
import { testGetPossibleDataTypesEvaluatedFromToken } from './testGetPossibleDataTypesEvaluatedFromToken.js';
import { testGetPossibleDataTypesForVariableAtToken } from './testGetPossibleDataTypesForVariableAtToken.js';
import { testIsAllHexadecimalDigits } from './testIsAllHexadecimalDigits.js';
import { testIsFirstLevelInstruction } from './testIsFirstLevelInstruction.js';
import { testIsInstructionList } from './testIsInstructionList.js';
import { testIsLoop } from './testIsLoop.js';
import { testIsPenSizeAlwaysZeroAtToken } from './testIsPenSizeAlwaysZeroAtToken.js';
import { testMightInitialRandomSeedBeUsed } from
'./testMightInitialRandomSeedBeUsed.js';
import { testMightInitialRandomSeedBeUsedInProcedure } from
'./testMightInitialRandomSeedBeUsedInProcedure.js';
import { testOperatorDataTypes } from
'./operator-data-types/testOperatorDataTypes.js';
import { testRandomPrimaryNames } from './testRandomPrimaryNames.js';
import { testStringFormats } from './string-formats/testStringFormats.js';
import { testTipGenerators } from './tip-generators/testTipGenerators.js';
import { testValidateIdentifier } from './testValidateIdentifier.js';
import { testValidation } from './validation/testValidation.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';
import { testVariableScraper } from './testVariableScraper.js';
import { testWriteOptimizedCachedParseTree } from './testWriteOptimizedCachedParseTree.js';
*/import { wrapAndCall } from '../../helpers/wrapAndCall.js';

const tests = [
/*testCachedParseTree,
testCachedParseTreeDirectory,
testCachedParseTreeGetLengthFromToken,
*/testCachedParseTreeGetPossibleTypesFromToken,
/*testCachedParseTreeGetPossibleTypesFromTokenCurvedBrackets,
testCachedParseTreeWithEvaluateTokensWithVariables,
testCommandDataTypes,
testCommandDataTypesDirectory,
testDoesTokenAlwaysOutput,
testDenoising,
testEvaluateStringLiteralVal,
testEvaluateToken,
testForLoops,
testGetInstructionListChildToken,
testGetOutputTypesForProcedure,
testGetPossibleDataTypesEvaluatedFromToken,
testGetPossibleDataTypesForVariableAtToken,
testIsAllHexadecimalDigits,
testIsFirstLevelInstruction,
testIsInstructionList,
testIsLoop,
testIsPenSizeAlwaysZeroAtToken,
testMightInitialRandomSeedBeUsed,
testMightInitialRandomSeedBeUsedInProcedure,
testOperatorDataTypes,
testRandomPrimaryNames,
testStringFormats,
testTipGenerators,
testValidateIdentifier,
testValidation,
testVariableDataTypes,
testVariableScraper,
testWriteOptimizedCachedParseTree*/
];

export function testParseTreeAnalysis(logger) {
	wrapAndCall(tests, logger);
};