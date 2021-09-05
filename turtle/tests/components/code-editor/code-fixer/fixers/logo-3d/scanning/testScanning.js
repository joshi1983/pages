import { testBreakLinesInProcedures } from
'./testBreakLinesInProcedures.js';
import { testFitToDefinedCommands } from
'./testFitToDefinedCommands.js';
import { testFixScanTokens } from
'./testFixScanTokens.js';
import { testMakeUnusualComments } from
'./testMakeUnusualComments.js';
import { testRemoveUnbalancedClosingBrackets } from
'./testRemoveUnbalancedClosingBrackets.js';
import { testReplaceSpecialCommands } from
'./testReplaceSpecialCommands.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testBreakLinesInProcedures,
		testFitToDefinedCommands,
		testFixScanTokens,
		testMakeUnusualComments,
		testRemoveUnbalancedClosingBrackets,
		testReplaceSpecialCommands
	], logger);
};