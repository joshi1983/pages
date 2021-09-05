import { testGetTokenEqualitiesFromCachedParseTree } from
'./testGetTokenEqualitiesFromCachedParseTree.js';
import { testGetTokenEqualitiesWithBreak } from
'./testGetTokenEqualitiesWithBreak.js';
import { testGetTokenEqualitiesWithIf } from
'./testGetTokenEqualitiesWithIf.js';
import { testGetTokenEqualitiesWithIfElse } from
'./testGetTokenEqualitiesWithIfElse.js';
import { testGetTokenEqualitiesWithLists } from
'./testGetTokenEqualitiesWithLists.js';
import { testGetTokenEqualitiesWithLoops } from
'./testGetTokenEqualitiesWithLoops.js';
import { testGetTokenEqualitiesWithProcedureCalls } from
'./testGetTokenEqualitiesWithProcedureCalls.js';
import { testGetTokenEqualitiesWithProcedures } from
'./testGetTokenEqualitiesWithProcedures.js';
import { testGetTokenEqualitiesWithSwap } from
'./testGetTokenEqualitiesWithSwap.js';
import { testGetTokenEqualitiesWithVariableMutations } from
'./testGetTokenEqualitiesWithVariableMutations.js';
import { testGetTokenEqualitiesWithVariousExamples } from
'./testGetTokenEqualitiesWithVariousExamples.js';
import { testTokenEqualities } from
'./token-equalities/testTokenEqualities.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTokenEvaluation(logger) {
	wrapAndCall([
		testGetTokenEqualitiesFromCachedParseTree,
		testGetTokenEqualitiesWithBreak,
		testGetTokenEqualitiesWithIf,
		testGetTokenEqualitiesWithIfElse,
		testGetTokenEqualitiesWithLists,
		testGetTokenEqualitiesWithLoops,
		testGetTokenEqualitiesWithProcedureCalls,
		testGetTokenEqualitiesWithProcedures,
		testGetTokenEqualitiesWithSwap,
		testGetTokenEqualitiesWithVariableMutations,
		testGetTokenEqualitiesWithVariousExamples,
		testTokenEqualities
	], logger);
};