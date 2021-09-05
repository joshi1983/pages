import { colonVariableReads } from
'./colonVariableReads.js';
import { fitToDefinedCommands } from
'./fitToDefinedCommands.js';
import { makeUnusualComments } from
'./makeUnusualComments.js';
import { quoteMakeVariables } from
'./quoteMakeVariables.js';
import { removeMakeAssignmentOperators } from
'./removeMakeAssignmentOperators.js';
import { removeUnbalancedClosingBrackets } from
'./removeUnbalancedClosingBrackets.js';
import { renameCommandsToWebLogo } from
'./renameCommandsToWebLogo.js';
import { replaceSpecialCommands } from
'./replaceSpecialCommands.js';

const processors = [
	replaceSpecialCommands,
	colonVariableReads,
	fitToDefinedCommands,
	makeUnusualComments,
	quoteMakeVariables,
	removeMakeAssignmentOperators,
	removeUnbalancedClosingBrackets,
	renameCommandsToWebLogo
];

export function fixScanTokens(tokens) {
	for (const process of processors) {
		process(tokens);
	}
};