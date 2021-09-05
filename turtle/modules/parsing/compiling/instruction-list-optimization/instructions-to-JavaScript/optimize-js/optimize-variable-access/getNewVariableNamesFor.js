import { getUnsafeIdentifiers } from './getUnsafeIdentifiers.js';
import { isValidIdentifier } from '../../../../../js-parsing/scanning/isValidIdentifier.js';
import { StringBuffer } from '../../../../../../StringBuffer.js';

const charReplacements = new Map([
	['?', 'p']
]);

function replaceRestrictedCharacters(name) {
	const result = new StringBuffer();
	for (let i = 0; i < name.length; i++) {
		const ch = name[i];
		const replacementChar = charReplacements.get(ch);
		if (replacementChar === undefined)
			result.append(ch);
		else
			result.append(replacementChar);
	}
	return result.toString();
}

export function getNewVariableNamesFor(startNames, rootToken, tokensToIgnore) {
	if (!(startNames instanceof Array))
		throw new Error(`Expected startNames to be an Array but got ${startNames}`);
	const unsafeIdentifiers = getUnsafeIdentifiers(rootToken, tokensToIgnore);
	const resultNames = [];
	for (let i = 0; i < startNames.length; i++) {
		const startName = startNames[i];
		let newName = replaceRestrictedCharacters(startName);
		if (!unsafeIdentifiers.has(newName) && resultNames.indexOf(newName) === -1 &&
		isValidIdentifier(newName))
			resultNames.push(newName);
		else {
			for (let offset = 2; true; offset++) {
				newName = `${startName}${offset}`;
				if (!unsafeIdentifiers.has(newName) && resultNames.indexOf(newName) === -1) {
					resultNames.push(newName);
					break;
				}
			}
		}
	}
	return resultNames;
};