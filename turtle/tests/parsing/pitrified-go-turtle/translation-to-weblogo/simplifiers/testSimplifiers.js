import { testConvertGotoToInfiniteFor } from './testConvertGotoToInfiniteFor.js';
import { testRemoveGotoSkippedSections } from './testRemoveGotoSkippedSections.js';
import { testRemoveUnreferencedLabels } from './testRemoveUnreferencedLabels.js';
import { testSimplifyIfStatementsWithConstantConditions } from './testSimplifyIfStatementsWithConstantConditions.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifiers(logger) {
	wrapAndCall([
		testConvertGotoToInfiniteFor,
		testRemoveGotoSkippedSections,
		testRemoveUnreferencedLabels,
		testSimplifyIfStatementsWithConstantConditions
	], logger);
};