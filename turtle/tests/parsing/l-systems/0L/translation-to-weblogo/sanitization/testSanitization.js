import { testAddAxiomIfMissing } from
'./testAddAxiomIfMissing.js';
import { testRemoveErroneousNumbersFromCommandSequences } from
'./testRemoveErroneousNumbersFromCommandSequences.js';
import { testRemoveErroneousTreeRootChildren } from
'./testRemoveErroneousTreeRootChildren.js';
import { testRemoveUndefinedIdentifiersFromCommandSequences } from
'./testRemoveUndefinedIdentifiersFromCommandSequences.js';
import { testSimplifyCommandSequence } from
'./testSimplifyCommandSequence.js';
import { testUseLastIfDuplicated } from
'./testUseLastIfDuplicated.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testSanitization(logger) {
	wrapAndCall([
		testAddAxiomIfMissing,
		testRemoveErroneousNumbersFromCommandSequences,
		testRemoveErroneousTreeRootChildren,
		testRemoveUndefinedIdentifiersFromCommandSequences,
		testSimplifyCommandSequence,
		testUseLastIfDuplicated
	], logger);
};