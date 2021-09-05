import { Command } from
'../../../../../../parsing/Command.js';
import { isIdentifier } from
'./isIdentifier.js';
import { isNumberLiteral } from
'./isNumberLiteral.js';

const refCommands = new Set([
	'local', 'make', 'mark', 'omark'
]);

const keywords = new Set([
	'end', 'to'
]);

function isKeyword(name) {
	return keywords.has(name);
}

function mightNeedAColon(tokens, i) {
	const token = tokens[i];
	const s = token.s;
	const ch = s[0];
	if (ch === '"' || ch === ':')
		return false;

	const prev = tokens[i - 1];
	if (refCommands.has(prev.s.toLowerCase()))
		return false;

	const info = Command.getCommandInfo(prev.s);
	if (info !== undefined) {
		const firstArgInfo = info.args[0];
		if (firstArgInfo !== undefined && firstArgInfo.refTypes !== undefined)
			return false;
	}
	return true;
}

function isVariableNameToken(tokens, i) {
	const prev = tokens[i - 1];
	const prevS = prev.s.toLowerCase();
	if (!refCommands.has(prevS))
		return false;

	if (isNumberLiteral(prevS))
		return false;

	const nameToken = tokens[i];
	if (isIdentifier(nameToken.s))
		return true;

	const ch = nameToken.s[0];
	if (ch !== '"' && ch !== '\'')
		return true;

	return true;
}

export function colonVariableReads(tokens) {
	const varNames = new Set();
	for (let i = 1; i < tokens.length; i++) {
		if (isVariableNameToken(tokens, i)) {
			const token = tokens[i];
			let name = token.s.toLowerCase();
			const ch = name[0];
			if (ch === '"' || ch === '\'')
				name = name.substring(1);
			if (!isKeyword(name))
				varNames.add(name);
		}
	}
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const s = token.s.toLowerCase();
		if (varNames.has(s) && mightNeedAColon(tokens, i)) {
			token.s = ':' + token.s;
		}
	}
};