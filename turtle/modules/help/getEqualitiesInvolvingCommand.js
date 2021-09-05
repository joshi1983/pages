import { Command } from
'../parsing/Command.js';
import { fetchJson } from
'../fetchJson.js';
import { getDescendentsOfType } from
'../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../parsing/LogoParser.js';
import { ParseLogger } from
'../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../SetUtils.js';

const equalities = await fetchJson('json/equalities.json');
let involvingMap;

function getCommandNamesFromCode(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	const result = new Set();
	for (const token of getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP)) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined)
			result.add(info.primaryName);
	}
	return result;
}

function refreshInvolvingCommands() {
	if (involvingMap === undefined) {
		involvingMap = new Map();
		for (const equalityInfo of equalities) {
			const names = getCommandNamesFromCode(equalityInfo[0]);
			SetUtils.addAll(names, getCommandNamesFromCode(equalityInfo[1]));
			for (const name of names) {
				let eqs = involvingMap.get(name);
				if (eqs === undefined) {
					eqs = [];
					involvingMap.set(name, eqs);
				}
				eqs.push(equalityInfo);
			}
		}
	}
}

export function getEqualitiesInvolvingCommand(commandName) {
	if (typeof commandName !== 'string')
		throw new Error(`commandName must be a string but commandName = ${commandName}`);

	const info = Command.getCommandInfo(commandName);
	if (info === undefined)
		throw new Error(`Unable to find command from name ${commandName}`);

	refreshInvolvingCommands();
	const result = involvingMap.get(info.primaryName);
	if (result === undefined)
		return new Set();

	return result;
};