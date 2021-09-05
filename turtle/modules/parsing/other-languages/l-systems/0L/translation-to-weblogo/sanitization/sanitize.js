import { addAxiomIfMissing } from
'./addAxiomIfMissing.js';
import { removeErroneousNumbersFromCommandSequences } from
'./removeErroneousNumbersFromCommandSequences.js';
import { removeErroneousTreeRootChildren } from
'./removeErroneousTreeRootChildren.js';
import { removeUndefinedIdentifiersFromCommandSequences } from
'./removeUndefinedIdentifiersFromCommandSequences.js';
import { simplifyCommandSequence } from
'./simplifyCommandSequence.js';
import { useLastIfDuplicated } from
'./useLastIfDuplicated.js';

const sanitizers = [
	addAxiomIfMissing,
	removeErroneousNumbersFromCommandSequences,
	removeErroneousTreeRootChildren,
	removeUndefinedIdentifiersFromCommandSequences,
	simplifyCommandSequence,
	useLastIfDuplicated
];

// Automatically fixes various potential problems with
// a 0L parse tree.
// This helps the code in type-processors work with less concern for problems 
// in the parse tree that stem from invalid 0L code.
export function sanitize(root) {
	for (const sanitizer of sanitizers) {
		sanitizer(root);
	}
};