import { Command } from '../../../Command.js';
import { fetchJson } from '../../../../fetchJson.js';
import { fetchText } from '../../../../fetchText.js';
import { getDescendentsOfTypes } from '../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getReferencedCustomTypes } from './getReferencedCustomTypes.js';
import { getTypeName } from './type-processors/helpers/getTypeName.js';
import { isArrayOfCustomTypeUsed } from './isArrayOfCustomTypeUsed.js';
import { isSpecial, translateToName } from './type-processors/function-calls/processSpecial.js';
import { QBasicInternalFunctions, toProcPath } from '../QBasicInternalFunctions.js';
import { QBasicOperators } from '../QBasicOperators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
import { typeTokenToCreateProcedure } from './typeTokenToCreateProcedure.js';
import { typeTokenToName } from './typeTokenToName.js';

const index = await fetchJson(toProcPath + '/index.json');
const procsMap = new Map();
const procDependencies = new Map([
	['implies', ['bool']],
	['_printstring', ['qbLocate']],
	['qbIntegerDivision', ['qbCint']],
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
	if (firstChild === undefined)
		return;

	let name;
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		name = firstChild.val.toLowerCase();
	else if (firstChild.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER)
		name = firstChild.children.map(t => t.val.toLowerCase()).join(' ');
	if (name !== undefined)
		return QBasicInternalFunctions.getFunctionInfo(name);
}

function opToInfo(token) {
	return QBasicOperators.getOperatorInfo(token.val);
}

export function includeAllReferencedProcedures(root, result, options) {
	const typeToCreateProcName = new Map();
	options.typeToCreateProcName = typeToCreateProcName;
	const toProcs = getDescendentsOfTypes(root, 
		[ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.FUNCTION_CALL]).
		filter(isOfInterest);
	const customTypes = getReferencedCustomTypes(root);
	if (toProcs.length === 0 && customTypes.length === 0)
		return;
	const procsToAddSet = new Set();
	if (customTypes.length !== 0) {
		if (isArrayOfCustomTypeUsed(root))
			procsToAddSet.add('initList');
		SetUtils.addAll(procsToAddSet, customTypes.map(function(typeToken) {
			const procName = typeTokenToName(typeToken, options);
			const procDefinition = typeTokenToCreateProcedure(typeToken, procName);
			procsMap.set(procName, procDefinition);
			typeToCreateProcName.set(getTypeName(typeToken), procName);
			return procName;
		}));
	}
	toProcs.forEach(function(toProcToken) {
		let toProcName;
		if (toProcToken.type === ParseTreeTokenType.FUNCTION_CALL) {
			const info = functionCallToInfo(toProcToken);
			if (info !== undefined)
				toProcName = info.toProc;
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
		if (content === undefined) {
			if (Command.getCommandInfo(procName) !== undefined)
				continue; // built in commands can be skipped here.

			throw new Error(`Unable to get procedure code for name ${procName}.  The supported names are ${Array.from(procsMap.keys()).join(',')}`);
		}
		result.append(content);
		result.append('\n\n');
	}
};