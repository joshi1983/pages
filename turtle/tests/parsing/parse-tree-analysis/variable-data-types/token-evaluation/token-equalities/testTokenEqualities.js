import { testForgetVariablesChangedInToken } from
'./testForgetVariablesChangedInToken.js';
import { testGetOutputValueTokenForProcedure } from
'./testGetOutputValueTokenForProcedure.js';
import { testGetProcedureEffectsOnGlobalVariables } from
'./testGetProcedureEffectsOnGlobalVariables.js';
import { testSimulateToken } from
'./testSimulateToken.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTokenEqualities(logger) {
	wrapAndCall([
		testForgetVariablesChangedInToken,
		testGetOutputValueTokenForProcedure,
		testGetProcedureEffectsOnGlobalVariables,
		testSimulateToken,
	], logger);
};