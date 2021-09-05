import { convertWalrusOperatorToAssignment } from './convertWalrusOperatorToAssignment.js';
import { removeUnstartedEndFillCalls } from './removeUnstartedEndFillCalls.js';
import { renameCustomFunctionsToAvoidWebLogoCommands } from './renameCustomFunctionsToAvoidWebLogoCommands.js';
import { simplifyForLoopInEnumerate } from './simplifyForLoopInEnumerate.js';
import { simplifyForLoopInEnumerateToRange } from './simplifyForLoopInEnumerateToRange.js';
import { simplifyLen } from './simplifyLen.js';

const simplifiers = [
	convertWalrusOperatorToAssignment,
	removeUnstartedEndFillCalls,
	renameCustomFunctionsToAvoidWebLogoCommands,
	simplifyForLoopInEnumerate,
	simplifyForLoopInEnumerateToRange,
	simplifyLen
];

export function simplifyParseTree(root) {
	if (typeof root !== 'object')
		throw new Error(`simplifyParseTree requires an object but found ${root}`);
	if (!(root.children instanceof Array))
		throw new Error(`simplifyParseTree requires root to be an object with a children array but found ${root.children}.  To be more specific, root must be a ParseTreeToken.`);

	let keepLooping = true;
	let i = 0;
	const infiniteCutoff = 100;
	while (keepLooping || i > infiniteCutoff) {
		keepLooping = false;
		i++;
		for (const simplify of simplifiers) {
			const simplifyResult = simplify(root);
			keepLooping = keepLooping || simplifyResult;
		}
	}
	if ( i >= infiniteCutoff )
		console.error(`The cutoff limit was reached for the simplify loop.  i = ${i}  This could mean there is a bug causing an infinite loop during simplification.`);
};