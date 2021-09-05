import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { getDescendentsOfTypes } from '../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isSpecial, translateToName } from './type-processors/function-calls/processSpecial.js';
import { QBasicInternalFunctions, toProcPath } from '../QBasicInternalFunctions.js';
import { QBasicOperators } from '../QBasicOperators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const index = await fetchJson(toProcPath + '/index.json');
const procsMap = new Map();
const procDependencies = new Map([
	['implies', ['bool']]
]);

for (const name of index) {
	const url = toProcPath + `/${name}`;
	let index = name.lastIndexOf('.');
	const procName = name.substring(0, index);
	procsMap.set(procName, await fetchText(url));
}

function isOfInterest(token) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const info = functionCallToInfo(token);
		if (info !== undefined && info.toProc !== undefined)
			return true;
		else
			return isSpecial(token);
	}
	else {
		const info = opToInfo(token);
		return info !== undefined && info.convertToProc !== undefined;
	}
}

function functionCallToInfo(token) {
	const firstChild = token.children[0];
	if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	return QBasicInternalFunctions.getFunctionInfo(firstChild.val);
}

function opToInfo(token) {
	return QBasicOperators.getOperatorInfo(token.val);
}

export function includeAllReferencedProcedures(root, result, options) {
	const toProcs = getDescendentsOfTypes(root, 
		[ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.FUNCTION_CALL]).
		filter(isOfInterest);
	if (toProcs.length === 0)
		return;
	const procsToAddSet = new Set();
	toProcs.forEach(function(toProcToken) {
		let toProcName;
		if (toProcToken.type === ParseTreeTokenType.FUNCTION_CALL) {
			toProcName = functionCallToInfo(toProcToken).toProc;
		}
		else {
			toProcName = opToInfo(toProcToken).convertToProc;
		}
		if (toProcName === undefined)
			toProcName = translateToName(toProcToken, options);
		if (toProcName !== undefined)
			procsToAddSet.add(toProcName);
	});
	for (const [key, procNames] of procDependencies) {
		if (procsToAddSet.has(key)) {
			SetUtils.addAll(procsToAddSet, procNames);
		}
	}
	const procsToAdd = Array.from(procsToAddSet);
	procsToAdd.sort();
	for (const procName of procsToAdd) {
		const content = procsMap.get(procName);
		if (content === undefined)
			throw new Error(`Unable to get procedure code for name ${procName}.  The supported names are ${Array.from(procsMap.keys()).join(',')}`);
		result.append(content);
		result.append('\n\n');
	}
};