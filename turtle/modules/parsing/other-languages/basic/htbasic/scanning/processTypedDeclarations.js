import { isIdentifier } from
'./isIdentifier.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

const typeToDefName = new Map([
	['integer', 'defint'],
	['long', 'deflng'],
	['real', 'defdbl']
]);
const htToQBasicTypes = new Map([
	['integer', 'integer'],
	['long', 'long'],
	['real', '_FLOAT']
]);
const otherHTBasicTypeNames = new Set([
	'complex'
]);

function shouldBecomeAsType(tokens, i) {
	if (i === 0)
		return false;

	const token = tokens[i];
	const typeName = token.s.toLowerCase();
	if (!htToQBasicTypes.has(typeName) &&
	!otherHTBasicTypeNames.has(typeName))
		return false;

	const prev = tokens[i - 1];
	if (prev.s === '(')
		return true;

	if (token.lineIndex !== prev.lineIndex)
		return false;

	if (prev.s === ',')
		return true;
	
	return false;
}

function shouldBecomeDef(tokens, i) {
	const token = tokens[i];
	if (!typeToDefName.has(token.s.toLowerCase()))
		return false;

	if (i === 0)
		return true;

	const prev = tokens[i - 1];
	if (prev.s === '(')
		return false;
	if (prev.lineIndex !== token.lineIndex)
		return true;

	if (prev.s === ',')
		return false;

	return true;
}

function getQBasicTypeNameFor(htBasicTypeName) {
	const result = htToQBasicTypes.get(htBasicTypeName);
	if (result === undefined)
		return htBasicTypeName;

	return result;
}

function isOfInterest(tokens, i) {
	const token = tokens[i];
	const next = tokens[i + 1];
	if (next === undefined ||
	!isIdentifier(next.s))
		return false;

	return shouldBecomeAsType(tokens, i) ||
	shouldBecomeDef(tokens, i);
}

export function processTypedDeclarations(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			const typeName = tokens[i].s.toLowerCase();
			if (shouldBecomeDef(tokens, i))
				tokens[i].s = typeToDefName.get(typeName);
			else {
				// convert something like (integer x,
				// to something like (x as integer,
				const next = tokens[i + 1];
				tokens[i].s = next.s;
				next.s = 'as';
				const typeKeyword = new Token(getQBasicTypeNameFor(typeName),
				next.colIndex + 1, next.lineIndex);
				tokens.splice(i + 2, 0, typeKeyword);
			}
		}
	}
};