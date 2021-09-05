import { Command } from
'../../../../../../parsing/Command.js';
import { isIdentifier } from
'./isIdentifier.js';
import { Logo3DCommands } from
'../Logo3DCommands.js';

const beforeNameTokenNames = new Set([
	'local', 'make', 'mark', 'omark', 'to'
]);

function namify(s) {
	while (s[0] === '"' || s[0] === '\'' ||
	s[0] === ':')
		s = s.substring(1);
	return s;
}

function isNameToken(tokens, i) {
	const prev = tokens[i - 1];
	if (prev === undefined)
		return false;

	const s = prev.s.toLowerCase();
	if (!beforeNameTokenNames.has(s))
		return false;
	return true;
}

function removeDigits(s) {
	return s.replace(/\d/g, '');
}

function fitName(oldName, usedNames) {
	const name = namify(oldName).toLowerCase();
	const trimmedDots = name.replace(/\./g, '');
	const trimmedDigits = removeDigits(name);
	const trimmed = removeDigits(trimmedDots);
	const candidateNames = [trimmedDots, trimmedDigits, trimmed];
	for (const candidate of candidateNames) {
		if (Command.getCommandInfo(candidate) ||
		Logo3DCommands.getCommandInfo(candidate) ||
		usedNames.has(candidate)) {
			return candidate;
		}
	}
	return oldName;
}

export function fitToDefinedCommands(tokens) {
	const namesUsed = new Set();
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const s = namify(token.s.toLowerCase());
		if (isIdentifier(s) && isNameToken(tokens, i))
			namesUsed.add(s);
	}
	for (let i = 0; i < tokens.length; i++) {
		if (isNameToken(tokens, i))
			continue;

		const token = tokens[i];
		const s = token.s.toLowerCase();
		if (!namesUsed.has(s) && isIdentifier(s) &&
		Command.getCommandInfo(s) === undefined &&
		Logo3DCommands.getCommandInfo(s) === undefined) {
			tokens[i].s = fitName(tokens[i].s, namesUsed);
		}
	}
};