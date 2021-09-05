import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getWebLogoSafeProcedureName } from '../../generic-parsing-utilities/getWebLogoSafeProcedureName.js';
import { isValidProcedureName } from '../isValidProcedureName.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { procStartToProcedureName } from '../procStartToProcedureName.js';

function isCallOfInterest(token) {
	if (token.children.length === 0)
		return false;
	if (!isValidProcedureName(token.children[0].val))
		return false;
	return true;
}

function isProcOfInterest(token) {
	const name = procStartToProcedureName(token.val);
	if (!isValidProcedureName(name))
		return false;
	return true;
}

export function getProcedureRenameMap(root) {
	const calls = getDescendentsOfType(root, ParseTreeTokenType.GO).filter(isCallOfInterest);
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
		let fromName = procStartToProcedureName(proc.val.toLowerCase());
		if (!result.has(fromName)) {
			const toName = getWebLogoSafeProcedureName(fromName, takenToNames);
			takenToNames.add(toName);
			result.set(fromName, toName);
		}
	}
	return result;
};