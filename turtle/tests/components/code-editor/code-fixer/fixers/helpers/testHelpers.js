/*import { testConvertLoopsToForever } from './testConvertLoopsToForever.js';
import { testFixDynamicScopes } from './testFixDynamicScopes.js';
import { testGenericSimplifyConditions } from './testGenericSimplifyConditions.js';
import { testGetAllVariableNamesSet } from './testGetAllVariableNamesSet.js';
import { testGetPolyUnsafeProcedures } from './testGetPolyUnsafeProcedures.js';
import { testGotoToForeverFixer } from './testGotoToForeverFixer.js';
import { testJoinConsecutiveCommandCalls } from './testJoinConsecutiveCommandCalls.js';
import { testMinusFixer } from './testMinusFixer.js';
import { testMoveArgsForParameterizedGroup } from './testMoveArgsForParameterizedGroup.js';
import { testProcessMigrateToCode } from './testProcessMigrateToCode.js';
import { testProcessRemoveInMigrationScanTokens } from './testProcessRemoveInMigrationScanTokens.js';
import { testRemoveCommandsWithoutRequiredParameters } from
'./testRemoveCommandsWithoutRequiredParameters.js';
import { testRemoveDoNothingCommandCalls } from './testRemoveDoNothingCommandCalls.js';
import { testRemoveEmptyIfStatements } from './testRemoveEmptyIfStatements.js';
import { testRemoveRedundantConsecutiveCommandCalls } from './testRemoveRedundantConsecutiveCommandCalls.js';
import { testRemoveTrivialInfiniteLoops } from './testRemoveTrivialInfiniteLoops.js';
import { testRemoveUnneededCurvedBrackets } from './testRemoveUnneededCurvedBrackets.js';*/
import { testRemoveUnreferencedLabelsFixer } from './testRemoveUnreferencedLabelsFixer.js';
/*import { testRemoveUnusedParameters } from './testRemoveUnusedParameters.js';
import { testSanitization } from './sanitization/testSanitization.js';
import { testSanitizeColourString } from './testSanitizeColourString.js';
import { testScanTokensToCode } from './testScanTokensToCode.js';
import { testScanWithMigration } from './testScanWithMigration.js';
*/import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		/*testConvertLoopsToForever,
		testFixDynamicScopes,
		testGenericSimplifyConditions,
		testGetAllVariableNamesSet,
		testGetPolyUnsafeProcedures,
		testGotoToForeverFixer,
		testJoinConsecutiveCommandCalls,
		testMinusFixer,
		testMoveArgsForParameterizedGroup,
		testProcessMigrateToCode,
		testProcessRemoveInMigrationScanTokens,
		testRemoveCommandsWithoutRequiredParameters,
		testRemoveDoNothingCommandCalls,
		testRemoveEmptyIfStatements,
		testRemoveRedundantConsecutiveCommandCalls,
		testRemoveTrivialInfiniteLoops,*/
		testRemoveUnreferencedLabelsFixer,/*
		testRemoveUnneededCurvedBrackets,
		testRemoveUnusedParameters,
		testSanitization,
		testSanitizeColourString,
		testScanTokensToCode,
		testScanWithMigration*/
	], logger);
};