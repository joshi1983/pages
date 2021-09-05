import { ParseTreeToken } from '../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const val = token.val;
	if (val !== 'geosphere2' && val !== 'geosphere3')
		return false;
	const next = token.nextSibling;
	if (next === null)
		return false;
	const nextNext = next.nextSibling;
	if (nextNext === null)
		return false;
	return true;
};

export function geosphereFixer(cachedParseTree, fixLogger) {
	const geosphereCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (geosphereCalls.length === 0)
		return;
	const removed = [];
	geosphereCalls.forEach(function(callToken) {
		const oldVal = callToken.val;
		const radiusToken = callToken.nextSibling;
		const colorToken = radiusToken.nextSibling;
		callToken.val = 'sphere';
		callToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(callToken, ParseTreeTokenType.LEAF);
		colorToken.remove();
		radiusToken.remove();
		callToken.appendChild(radiusToken);
		const setFillColorToken = new ParseTreeToken('setFillColor', null, callToken.lineIndex, callToken.colIndex - 2, ParseTreeTokenType.PARAMETERIZED_GROUP);
		colorToken.lineIndex = callToken.lineIndex;
		colorToken.colIndex = callToken.colIndex - 1;
		setFillColorToken.appendChild(colorToken);
		callToken.appendPreviousSibling(setFillColorToken);
		cachedParseTree.tokenAdded(setFillColorToken);
		fixLogger.log(`Converted call to ${oldVal} to sphere because the sphere command is how spheres are added to WebLogo drawings.`, callToken);
	});
};