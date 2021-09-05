import { testFixDynamicScopes } from './testFixDynamicScopes.js';
import { testGetAllVariableNamesSet } from './testGetAllVariableNamesSet.js';
import { testGetPolyUnsafeProcedures } from './testGetPolyUnsafeProcedures.js';
import { testMinusFixer } from './testMinusFixer.js';
import { testMoveArgsForParameterizedGroup } from './testMoveArgsForParameterizedGroup.js';
import { testProcessMigrateToCode } from './testProcessMigrateToCode.js';
import { testProcessRemoveInMigrationScanTokens } from './testProcessRemoveInMigrationScanTokens.js';
import { testRemoveEmptyIfStatements } from './testRemoveEmptyIfStatements.js';
import { testRemoveUnneededCurvedBrackets } from './testRemoveUnneededCurvedBrackets.js';
import { testRemoveUnusedParameters } from './testRemoveUnusedParameters.js';
import { testSanitization } from './sanitization/testSanitization.js';
import { testSanitizeColourString } from './testSanitizeColourString.js';
import { testScanTokensToCode } from './testScanTokensToCode.js';
import { testScanWithMigration } from './testScanWithMigration.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testFixDynamicScopes,
		testGetAllVariableNamesSet,
		testGetPolyUnsafeProcedures,
		testMinusFixer,
		testMoveArgsForParameterizedGroup,
		testProcessMigrateToCode,
		testProcessRemoveInMigrationScanTokens,
		testRemoveEmptyIfStatements,
		testRemoveUnneededCurvedBrackets,
		testRemoveUnusedParameters,
		testSanitization,
		testSanitizeColourString,
		testScanTokensToCode,
		testScanWithMigration,
	], logger);
};