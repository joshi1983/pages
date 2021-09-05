import { CachedParseTree } from
'../../parse-tree-analysis/CachedParseTree.js';
import { Command } from
'../../Command.js';
import { DataTypes } from
'../../data-types/DataTypes.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../parse-tree-analysis/getProceduresMap.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const replacements = [
	{
		'from': 'setFillColor',
		'dataTypes': 'gradient',
		'to': 'setFillGradient'
	},
	{
		'from': 'setPenColor',
		'dataTypes': 'gradient',
		'to': 'setPenGradient'
	}
];
export const names = new Set(replacements.map(r => r.from));

function getReplacementForCommandName(commandName) {
	const info = Command.getCommandInfo(commandName);
	if (info === undefined || !names.has(info.primaryName))
		return;
	for (const replacementInfo of replacements) {
		if (replacementInfo.from === info.primaryName)
			return replacementInfo;
	}
}

function isOfInterest(token) {
	if (token.children.length !== 1)
		return false;
	return getReplacementForCommandName(token.val) !== undefined;
}

export function replaceCommandsToFitDataTypesFixer(root) {
	const calls = getDescendentsOfType(root, ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	if (calls.length !== 0) {
		// analyze data types.
		const proceduresMap = getProceduresMap(root);
		const cachedParseTree = new CachedParseTree(root, proceduresMap, new Map());
		const tokenTypes = cachedParseTree.getTokensToDataTypes();
		for (const call of calls) {
			const child = call.children[0];
			const childTypes = tokenTypes.get(child);
			if (childTypes !== undefined) {
				const childTypesStr = DataTypes.stringify(childTypes);
				const replacementInfo = getReplacementForCommandName(call.val);
				if (childTypesStr === replacementInfo.dataTypes)
					call.val = replacementInfo.to;
			}
		}
	}
};