import { testConditionalGotoToBreak } from './testConditionalGotoToBreak.js';
import { testConvertGotoToInfiniteFor } from './testConvertGotoToInfiniteFor.js';
import { testGotoToBreak } from './testGotoToBreak.js';
import { testGotoToContinue } from './testGotoToContinue.js';
import { testLogicallyNegate } from './testLogicallyNegate.js';
import { testRemoveGotoSkippedSections } from './testRemoveGotoSkippedSections.js';
import { testRemoveUnreferencedLabels } from './testRemoveUnreferencedLabels.js';
import { testSimplifyIfStatementsWithConstantConditions } from './testSimplifyIfStatementsWithConstantConditions.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifiers(logger) {
	wrapAndCall([
		testConditionalGotoToBreak,
		testConvertGotoToInfiniteFor,
		testGotoToBreak,
		testGotoToContinue,
		testLogicallyNegate,
		testRemoveGotoSkippedSections,
		testRemoveUnreferencedLabels,
		testSimplifyIfStatementsWithConstantConditions
	], logger);
};