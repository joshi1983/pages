import { Command } from
'../../Command.js';
import { groupNamesMap } from
'../../../command-groups/getCommandGroups.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getMethodNameForCommand } from
'../../getMethodNameForCommand.js';
import { parse } from
'../../other-languages/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../other-languages/js-parsing/ParseTreeTokenType.js';
import { StringBuffer } from
'../../../StringBuffer.js';

let identifiersOfInterestMap;

function refreshIdentifiersOfInterest() {
	if (identifiersOfInterestMap === undefined) {
		identifiersOfInterestMap = new Map();
		for (const info of Command.getAllCommandsInfo()) {
			const name = getMethodNameForCommand(info.primaryName);
			identifiersOfInterestMap.set(name, info);
		}
	}
}

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false; // The x in p.x shouldn't be of interest.

	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT &&
	parent.children[1] === token)
		return false; // The x in [p].x = 3 shouldn't be of interest.

	return identifiersOfInterestMap.has(token.val);
}

export function getImportStatements(jsCode) {
	refreshIdentifiersOfInterest();
	const parseResult = parse(jsCode);
	const identifiers = getDescendentsOfType(parseResult.root, ParseTreeTokenType.IDENTIFIER).
		filter(isOfInterest);
	const result = new StringBuffer();
	const importedGroupNames = new Set();
	for (const identifier of identifiers) {
		const info = identifiersOfInterestMap.get(identifier);
		if (!importedGroupNames.has(info.group)) {
			const moduleName = groupNamesMap.get(info.group);
			result.append(`import { ${moduleName} } from './modules/command-groups/${moduleName}.js'`);
			importedGroupNames.add(info.group);
		}
	}
	return result.toString();
};