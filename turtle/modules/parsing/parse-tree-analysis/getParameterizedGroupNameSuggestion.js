import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isRecognized(name, proceduresMap) {
	name = name.toLowerCase();
	if (Command.getCommandInfo(name) !== undefined)
		return true;
	if (proceduresMap.has(name.toLowerCase()))
		return true;
	return false;
}

function getHinted(name) {
	name = name.toLowerCase();
	const commandInfo = Command.getCommandInfoByHintName(name);
	if (commandInfo === undefined) {
		// FIXME: check if any procedure or command names are just 1 character away from matching name.
		
	}
	else
		return commandInfo;
}

/*
Returns undefined if no suggestion is found.
Returns an Array of tokens and a name, if one is found.
*/
export function getParameterizedGroupNameSuggestion(firstToken, proceduresMap) {
	let name = '';
	let nameWithSpaces = '';
	const checkedSiblingTokens = [];
	let result = undefined;
	for (let sibling = firstToken;
		sibling !== null && sibling.type === ParseTreeTokenType.LEAF;
		sibling = sibling.nextSibling) {
		name += sibling.val;
		if (nameWithSpaces === '')
			nameWithSpaces = sibling.val;
		else
			nameWithSpaces += " " + sibling.val;
		if (sibling !== firstToken)
			checkedSiblingTokens.push(sibling);
		if (isRecognized(name, proceduresMap)) {
			return {
				'name': name,
				'nameWithSpaces': nameWithSpaces,
				'extraTokens': checkedSiblingTokens,
				'isHint': false
			};
		}
		else if (getHinted(name) !== undefined) {
			const hintInfo = getHinted(name);
			result = {
				'name': hintInfo.primaryName,
				'nameWithSpaces': nameWithSpaces,
				'extraTokens': checkedSiblingTokens.slice(0), // clone so future mutations don't change this set.
				'isHint': true
			};
		}
	}
	return result;
};