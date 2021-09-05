import { Command } from
'../../../../../parsing/Command.js';
import { Operators } from
'../../../../../parsing/Operators.js';

function isSingleValueToken(token) {
	if (!isNaN(token.s))
		return true; // number literal evaluates on its own
	if (token.s[0] === '"')
		return true; // string literal evaluates on its own
	if (token.s[0] === ':')
		return true; // variable read evaluates on its own
	if (['false', 'true'].indexOf(token.s.toLowerCase()) === 0)
		return true; // boolean literal evaluates on its own
	const info = Command.getCommandInfo(token.s);
	if (info === undefined)
		return false;
	if (info.args instanceof Array &&
	info.args.length === 0)
		return true;

	return false;
}

function isDefinitelyBinaryOperator(token) {
	if (token === undefined)
		return false;
	const info = Operators.getOperatorInfo(token.s);
	if (info === undefined)
		return false;
	if (Operators.canBeUnary(info))
		return false; // might be a unary operator
	return true;
}

function getParameterTokenCount(commandInfo, scanTokens, i) {
	if (commandInfo.args === undefined)
		return;

	let result = i;
	const argCount = commandInfo.args.length;
	for (let j = 0; j < argCount; j++) {
		let curvedBracketBalance = 0;
		let squareBracketBalance = 0;
		let isFirst = true;
		for (result++; true; result++) {
			const token = scanTokens[i + result];
			if (token === undefined)
				return result - 1;
			if (token.s === '(') {
				curvedBracketBalance++;
			}
			else if (token.s === '[') {
				squareBracketBalance++;
			}
			else if (token.s === ')') {
				curvedBracketBalance--;
			}
			else if (token.s === ']') {
				squareBracketBalance--;
			}
			if (isFirst &&
			isSingleValueToken(token)) {
				if (isDefinitelyBinaryOperator(scanTokens[i + result + 1])) {
					result++;
					continue;
				}
				break;
			}
			if (curvedBracketBalance === 0 &&
			squareBracketBalance === 0 &&
			isFirst === false) {
				if (isDefinitelyBinaryOperator(scanTokens[i + result + 1])) {
					result++;
					continue;
				}
				break;
			}
			if (curvedBracketBalance < 0 ||
			squareBracketBalance < 0)
				return; // indicate no count found
			isFirst = false;
		}
	}
	return result;
}

export function processRemoveInMigrationScanTokens(scanTokens, info, commandsMap) {
	if (!(scanTokens instanceof Array))
		throw new Error(`scanTokens must be an Array but found ${scanTokens}`);
	if (!(commandsMap instanceof Map))
		throw new Error(`commandsMap must be a Map but found ${commandsMap}`);

	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const name = info.caseSensitiveCommandNames === true ? token.s : token.s.toLowerCase();
		const commandInfo = commandsMap.get(name);
		if (commandInfo !== undefined &&
		commandInfo.removeInMigration === true) {
			const paramTokenCount = getParameterTokenCount(commandInfo, scanTokens, i);
			if (paramTokenCount !== undefined) {
				// remove the tokens.
				scanTokens.splice(i, paramTokenCount + 1);
				i--;
			}
		}
	}
};