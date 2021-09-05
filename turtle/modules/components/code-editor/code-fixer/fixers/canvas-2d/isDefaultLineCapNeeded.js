import { getDeepestName } from
'../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/js-parsing/ParseTreeTokenType.js';

const names = new Set(['arc', 'bezierCurveTo',
'lineTo', 'quadraticCurveTo', 'stroke', 'strokeRect', 'strokeText']);

function isOfInterest(token) {
	const name = getDeepestName(token);
	if (!names.has(name))
		return false;
	return true;
}

export function isDefaultLineCapNeeded(root) {
	return getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		some(isOfInterest);
};