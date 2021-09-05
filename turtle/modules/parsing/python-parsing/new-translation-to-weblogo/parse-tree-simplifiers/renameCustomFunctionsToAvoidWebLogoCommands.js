import { Command } from
'../../../Command.js';
import { filterBracketsAndCommas } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function defToName(funcDefToken) {
	const result = funcDefToken.children[1];
	if (result === undefined || result.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	return result;
}

function defToArgList(funcDefToken) {
	const argList = funcDefToken.children[2];
	if (argList === undefined || argList.type !== ParseTreeTokenType.ARGUMENT_LIST)
		return;

	return argList;
};

function isOfInterest(token) {
	const nameToken = defToName(token);
	if (nameToken === undefined)
		return false;

	if (defToArgList(token) === undefined)
		return false;

	const info = Command.getCommandInfo(nameToken.val);
	return info !== undefined;
}

function getNewName(originalName, takenNames) {
	for (let i = 1; true; i++) {
		const newName = originalName + i;
		if (!takenNames.has(newName.toLowerCase()) &&
		Command.getCommandInfo(newName) === undefined) {
			return newName;
		}
	}
}

export function renameCustomFunctionsToAvoidWebLogoCommands(root) {
	const allDefs = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_DEFINITION);
	const defs = allDefs.filter(isOfInterest);
	if (defs.length === 0)
		return false;

	const existingNames = allDefs.filter(t => defToName(t) !== undefined).map(t => defToName(t).val);
	const existingNamesLowerCase = new Set(existingNames.map(name => name.toLowerCase()));
	const existingNamesSet = new Set(existingNames);
	const funcCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(fc => existingNamesSet.has(fc.val));
	defs.forEach(function(defToken) {
		const nameToken = defToName(defToken);
		const a = defToArgList(defToken);
		const argLen = filterBracketsAndCommas(a.children).length;
		const originalName = nameToken.val;
		const newName = getNewName(originalName, existingNamesLowerCase);
		nameToken.val = newName;
		for (const funcCall of funcCalls) {
			if (funcCall.val === originalName) {
				const cArgList = funcCall.children[0];
				if (cArgList !== undefined) {
					const actualArgs = filterBracketsAndCommas(cArgList.children);
					if (actualArgs.length !== argLen)
						continue;
				}
				funcCall.val = newName;
			}
		}
		existingNamesLowerCase.add(newName.toLowerCase());
	});
	return true;
};