import { getUnsafeIdentifiers } from './getUnsafeIdentifiers.js';

export function getNewVariableNamesFor(startNames, rootToken, tokensToIgnore) {
	if (!(startNames instanceof Array))
		throw new Error(`Expected startNames to be an Array but got ${startNames}`);
	const unsafeIdentifiers = getUnsafeIdentifiers(rootToken, tokensToIgnore);
	const resultNames = [];
	for (let i = 0; i < startNames.length; i++) {
		const startName = startNames[i];
		let newName = startName;
		if (!unsafeIdentifiers.has(newName) && resultNames.indexOf(newName) === -1)
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