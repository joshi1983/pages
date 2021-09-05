import { getDistinctVariableName } from
'../../getDistinctVariableName.js';
import { Keyword } from
'../../../../../Keyword.js';
const charsToRemove = new Set('!@#$%^&'.split(''));

const restrictedWebLogoIdentifiers = new Set(['to']);
Keyword.getAllKeywords().forEach(function(key) {
	restrictedWebLogoIdentifiers.add(key.toLowerCase());
});

export function identifierToWebLogoIdentifier(s) {
	s = s.split('').filter(c => !charsToRemove.has(c)).join('');
	return getDistinctVariableName(s, {
		'identifierRenameMap': restrictedWebLogoIdentifiers
	});
};