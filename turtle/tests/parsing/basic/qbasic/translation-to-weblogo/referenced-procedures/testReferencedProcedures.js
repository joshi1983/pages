import { testNeedsGlobalScreenVariable } from
'./testNeedsGlobalScreenVariable.js';
import { testNeedsQBPalette_0 } from
'./testNeedsQBPalette_0.js';
import { testNeedsQBPalette_2 } from
'./testNeedsQBPalette_2.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testReferencedProcedures(logger) {
	wrapAndCall([
		testNeedsGlobalScreenVariable,
		testNeedsQBPalette_0,
		testNeedsQBPalette_2
	], logger);
};