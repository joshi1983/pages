import { Command } from
'../../../../../parsing/Command.js';
import { Keyword } from
'../../../../../parsing/Keyword.js';
const superLogoIdentifierRegex = /^[a-z_]([a-z_\d\-]*[a-z_\d])?$/i;

export function isValidProcedureName(s) {
	return superLogoIdentifierRegex.test(s);
};

function getLengthToJoin(scanTokens, i) {
	const prev = scanTokens[i - 1];
	if (prev.s.toLowerCase() !== 'to')
		return 0;
	const first = scanTokens[i];
	if (first.s === '-')
		return 0;
	if (!isValidProcedureName(first.s))
		return 0;

	let result = 0;
	let s = first.s;
	let last = first;
	for (let len = 1; len < 20; len++) {
		const next = scanTokens[i + len];
		if (next === undefined)
			break;
		if (next.lineIndex !== last.lineIndex)
			break;
		if (next.colIndex !== next.s.length + last.colIndex)
			break;
		s += next.s;
		if (isValidProcedureName(s))
			result = len;
		last = next;
	}
	return result;
}

function joinTokens(scanTokens, i, len) {
	const tok = scanTokens[i];
	for (let j = 1 ; j <= len; j++) {
		const next = scanTokens[i + j];
		tok.s += next.s;
	}
	const last = scanTokens[i + len];
	tok.colIndex = last.colIndex;
	scanTokens.splice(i + 1, len); // remove the joined tokens.
}

function getCallProcNameLength(scanTokens, i, procNamesToJoin) {
	let newProcNamesRemaining = new Set(procNamesToJoin);
	let s = '';
	let len = 0;
	let result = 0;
	while (procNamesToJoin.size !== 0) {
		const next = scanTokens[i + len];
		if (next === undefined)
			break;
		s += next.s.toLowerCase();
		if (procNamesToJoin.has(s))
			result = len;
		for (const name of procNamesToJoin) {
			if (name.startsWith(s)) {
				newProcNamesRemaining.add(name);
			}
		}
		procNamesToJoin = newProcNamesRemaining;
		len++;
	}
	return result;
}

function isGoodName(takenNames, newName) {
	// renaming to another existing procedure's name will be bad.
	if (takenNames.has(newName.toLowerCase()))
		return false;

	// Translating to a WebLogo command's name will be bad.
	if (Command.getCommandInfo(newName) !== undefined)
		return false;
	
	// Translating to a WebLogo keyword will be bad.
	if (Keyword.getKeywordInfo(newName) !== undefined)
		return false;

	return true;
}

function getGoodNewName(takenNames, nameToReplace) {
	const prefix = nameToReplace.replaceAll('-', '');
	if (isGoodName(takenNames, prefix))
		return prefix;
	for (let i = 1; true; i++) {
		const newName = prefix + i;
		if (isGoodName(takenNames, newName))
			return newName;
	}
}

function getRenameMap(takenNames, namesNeedingReplacement) {
	const result = new Map();
	for (const nameToReplace of namesNeedingReplacement) {
		const newName = getGoodNewName(takenNames, nameToReplace);
		result.set(nameToReplace.toLowerCase(), newName);
		takenNames.add(newName.toLowerCase());
	}
	return result;
}

export function joinHyphenatedProcedureNames(scanTokens) {
	const procNamesToJoin = new Set();
	for (let i = 1; i < scanTokens.length; i++) {
		const len = getLengthToJoin(scanTokens, i);
		if (len > 1) {
			joinTokens(scanTokens, i, len);
			procNamesToJoin.add(scanTokens[i].s);
		}
	}
	if (procNamesToJoin.size === 0)
		return; // nothing more to do.

	const takenNames = new Set();
	const procNamesToJoinLowerCase = new Set(Array.from(procNamesToJoin).map(s => s.toLowerCase()));
	// join possible calls to the hyphenated procedures.
	for (let i = 0; i < scanTokens.length; i++) {
		const len = getCallProcNameLength(scanTokens, i, procNamesToJoinLowerCase);
		if (len > 1) {
			joinTokens(scanTokens, i, len);
		}
		takenNames.add(scanTokens[i].s.toLowerCase());
	}
	const renameMap = getRenameMap(takenNames, procNamesToJoin);
	for (const token of scanTokens) {
		const to = renameMap.get(token.s.toLowerCase());
		if (to !== undefined)
			token.s = to;
	}
};