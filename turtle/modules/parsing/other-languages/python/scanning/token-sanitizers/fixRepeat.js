import { isIdentifier } from
'../isIdentifier.js';
import { isIntegerLiteral } from
'../isIntegerLiteral.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

function isRepeatOfInterest(scanTokens, i) {
	const repeatToken = scanTokens[i];
	if (repeatToken.s !== 'repeat')
		return false;

	if (i > 0) {
		const prev = scanTokens[i - 1];
		if (prev.lineIndex === repeatToken.lineIndex)
			return false;
	}

	const numberToken = scanTokens[i + 1];
	if (numberToken === undefined ||
	numberToken.lineIndex !== repeatToken.lineIndex ||
	(!isIntegerLiteral(numberToken.s) && !isIdentifier(numberToken.s)))
		return false;

	const colonToken = scanTokens[i + 2];
	if (colonToken === undefined ||
	colonToken.lineIndex !== repeatToken.lineIndex ||
	colonToken.s !== ':')
		return false;

	return true;
}

function scrapeIdentifiers(tokens) {
	return new Set(tokens.filter(t => isIdentifier(t.s)).map(t => t.s));
}

function getUniqueIdentifier(takenIdentifiers) {
	for (let i = 1; true; i++) {
		const newName = `_${i}`;
		if (!takenIdentifiers.has(newName))
			return newName;
	}
}

function stringsToTokens(strings, previousToken) {
	const result = [];
	let colIndex = previousToken.colIndex;
	for (const s of strings) {
		colIndex += s.length;
		result.push(new Token(s, previousToken.lineIndex, colIndex));
	} 
	
	return result;
}

// This converts some repeat-statements found at: https://csinschools.io/lessons/introduction-to-turtle-graphics/
// to Python's for-loops.
export function fixRepeat(scanTokens) {
	let usedIdentifiers;
	for (let i = 0; i < scanTokens.length; i++) {
		if (isRepeatOfInterest(scanTokens, i)) {
			// replace something like repeat 20:
			// with for _123 in range(20):
			const repeatToken = scanTokens[i];
			repeatToken.s = 'for';
			const numberToken = scanTokens[i + 1];
			if (usedIdentifiers === undefined)
				usedIdentifiers = scrapeIdentifiers(scanTokens);
			const uniqueIdentifier = getUniqueIdentifier(usedIdentifiers);
			usedIdentifiers.add(uniqueIdentifier);
			const newTokens = stringsToTokens([uniqueIdentifier, 'in', 'range', '('], repeatToken);
			scanTokens.splice(i + 1, 0, ...newTokens);
			scanTokens.splice(i + 2 + newTokens.length, 0, ...stringsToTokens([')'], numberToken));
		}
	}
};