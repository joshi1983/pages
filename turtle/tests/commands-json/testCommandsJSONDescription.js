import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');
const commandPrimaryNames = commands.map(info => info.primaryName);

function getAllIndexesOf(s, primaryName, originalCase) {
	const result = [];
	const substring = primaryName.toLowerCase();
	let index = s.indexOf(substring);
	while (index !== -1) {
		if (isProblematicCommandNameMatch(originalCase, index, primaryName))
			result.push(index);
		index = s.indexOf(substring, index + 1);
	}
	return result;
}

function isLetter(c) {
	return c.toLowerCase() !== c.toUpperCase();
}

function isProblematicCommandNameMatch(originalCase, index, primaryName) {
	const found = originalCase.substring(index, index + primaryName.length);
	if (found === primaryName)
		return false; // no problem because case-sensitive match found.
	if (index > 0 && isLetter(originalCase.charAt(index - 1)))
		return false; // no problem because the primaryName is just part of a larger word.
	if (index + primaryName.length < originalCase.length) {
		if (isLetter(originalCase.charAt(index + primaryName.length)))
			return false; // no problem because the primaryName is just starting a larger word.
	}
	// Look for the command being referenced at the beginning of a sentence.
	for (let i = index - 1; i >= 0; i--) {
		const c = originalCase.charAt(i);
		if (c !== ' ' && c === '.') {
			if (found.substring(1) === primaryName.substring(1))
				return false;
			else
				break;
		}
	}
	// another case of starting a sentence.
	if (index === 0 && found.substring(1) === primaryName.substring(1))
		return false;
	return true;
}

export function testCommandsJSONDescription(logger) {
	commands.
		forEach(function(commandInfo) {
			const prefixLogger = prefixWrapper('Command ' + commandInfo.primaryName, logger);
			if (typeof commandInfo.description !== 'string')
				prefixLogger(`description expected to be a string but got ${commandInfo.description}`);
			else {
				const descriptionLowerCase = commandInfo.description.toLowerCase();
				for (let i = 0; i < commandPrimaryNames.length; i++) {
					const primaryName = commandPrimaryNames[i];
					if (primaryName === 'if')
						continue;
					const allIndexes = getAllIndexesOf(descriptionLowerCase, primaryName, commandInfo.description);
					allIndexes.forEach(function(index) {
						prefixLogger('Any reference to a command should be a case-sensitive match to the primaryName.  '+
						`Expected ${primaryName} but found ${commandInfo.description.substring(index, index + primaryName.length)} in description`);
					});
				}
			}
		});
};