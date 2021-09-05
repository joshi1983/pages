import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getWebLogoSafeProcedureName } from '../../generic-parsing-utilities/getWebLogoSafeProcedureName.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isCallOfInterest(token) {
	if (token.val.toLowerCase() !== 'call')
		return false;
	if (token.children.length === 0)
		return false;
	return true;
}

function isProcOfInterest(token) {
	if (token.val.toLowerCase() !== 'proc')
		return false;
	if (token.children.length === 0)
		return false;
	return true;
}

export function getProcedureRenameMap(root) {
	const calls = getDescendentsOfType(root, ParseTreeTokenType.INSTRUCTION).filter(isCallOfInterest);
	const procs = getDescendentsOfType(root, ParseTreeTokenType.PROC_START).filter(isProcOfInterest);
	const result = new Map();
	const takenToNames = new Set();
	for (const call of calls) {
		const fromName = call.children[0].val.toLowerCase();
		if (!result.has(fromName)) {
			const toName = getWebLogoSafeProcedureName(fromName, takenToNames);
			takenToNames.add(toName);
			result.set(fromName, toName);
		}
	}
	for (const proc of procs) {
		let fromName = proc.children[0].val.toLowerCase();
		if (fromName.startsWith('@@'))
			fromName = fromName.substring(1); // match the pattern used by calls.
		if (!result.has(fromName)) {
			const toName = getWebLogoSafeProcedureName(fromName, takenToNames);
			takenToNames.add(toName);
			result.set(fromName, toName);
		}
	}
	return result;
};