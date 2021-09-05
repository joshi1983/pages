import { testForgetVariablesChangedInToken } from
'./testForgetVariablesChangedInToken.js';
import { testGetGeneralProcedureStartState } from
'./testGetGeneralProcedureStartState.js';
import { testGetOutputValueTokenForProcedure } from
'./testGetOutputValueTokenForProcedure.js';
import { testGetProcedureEffectsOnGlobalVariables } from
'./testGetProcedureEffectsOnGlobalVariables.js';
import { testGetUnmutatableGlobalVariables } from
'./testGetUnmutatableGlobalVariables.js';
import { testIsDefinitelyEndingTheInstructionList } from
'./testIsDefinitelyEndingTheInstructionList.js';
import { testSimulateToken } from
'./testSimulateToken.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTokenEqualities(logger) {
	wrapAndCall([
		testForgetVariablesChangedInToken,
		testGetGeneralProcedureStartState,
		testGetOutputValueTokenForProcedure,
		testGetProcedureEffectsOnGlobalVariables,
		testGetUnmutatableGlobalVariables,
		testIsDefinitelyEndingTheInstructionList,
		testSimulateToken,
	], logger);
};