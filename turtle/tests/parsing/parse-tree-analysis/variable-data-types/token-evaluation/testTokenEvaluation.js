import { testGetTokenEqualitiesFromCachedParseTree } from
'./testGetTokenEqualitiesFromCachedParseTree.js';
import { testGetTokenEqualitiesWithLists } from
'./testGetTokenEqualitiesWithLists.js';
import { testGetTokenEqualitiesWithLoops } from
'./testGetTokenEqualitiesWithLoops.js';
import { testGetTokenEqualitiesWithProcedures } from
'./testGetTokenEqualitiesWithProcedures.js';
import { testGetTokenEqualitiesWithSwap } from
'./testGetTokenEqualitiesWithSwap.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTokenEvaluation(logger) {
	wrapAndCall([
		testGetTokenEqualitiesFromCachedParseTree,
		testGetTokenEqualitiesWithLists,
		testGetTokenEqualitiesWithLoops,
		testGetTokenEqualitiesWithProcedures,
		testGetTokenEqualitiesWithSwap
	], logger);
};