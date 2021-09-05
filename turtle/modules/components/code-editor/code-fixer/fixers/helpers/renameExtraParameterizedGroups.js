import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { Command } from
'../../../../../parsing/Command.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export function renameExtraParameterizedGroups(root, migrationInfo) {
	if (typeof migrationInfo !== 'object')
		throw new Error(`migrationInfo must be an object but found ${migrationInfo}`);
	if (!(migrationInfo.commands instanceof Array))
		throw new Error(`migrationInfo.commands must be an Array but found ${migrationInfo.commands}`);
		
	const interestingNames = new Map();
	for (const info of migrationInfo.commands) {
		if (info.toProc !== undefined) {
			const names = [info.primaryName];
			if (info.names !== undefined)
				ArrayUtils.pushAll(names, info.names);

			for (const name of names) {
				if (Command.getCommandInfo(name) !== undefined)
					interestingNames.set(name.toLowerCase(), info.toProc);
			}
		}
	}
	const groups = getDescendentsOfType(root, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(t => typeof t.val === 'string' && interestingNames.has(t.val.toLowerCase()));
	let result = false;
	if (groups.length !== 0) {
		const proceduresMap = getProceduresMap(root);
		groups.forEach(function(group) {
			group.val = interestingNames.get(group.val.toLowerCase());
			const procedure = proceduresMap.get(group.val.toLowerCase());
			if (procedure !== undefined) {
				group.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
				// FIXME: try to group enough parameters to match the procedure's parameters.length.
			}
			else {
				group.type = ParseTreeTokenType.LEAF;
				while (group.children.length !== 0) {
					const lastChild = group.children[group.children.length - 1];
					lastChild.remove();
					group.appendSibling(lastChild);
				}
			}
			result = true;
		});
	}
	return result;
};