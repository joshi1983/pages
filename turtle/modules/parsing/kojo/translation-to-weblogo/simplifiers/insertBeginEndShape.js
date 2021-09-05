import { filterBracketsAndCommas } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { shouldBeWrappedInPoly } from
'../type-processors/function-calls/shouldBeWrappedInPoly.js';

// Some functions that a filled shape should not continue through
const pathInteruptingNames = new Set([
	'circle', 'clear', 'cleari', 'cleari', 'ellipse', 'hop',
	'setFillColor', 'setPenColor', 'setPenThickness', 'setPosition',
	'setScale', 'write'
]);

const pathFunctionNames = new Set([
	'back', 'bezierVertex', 'curveVertex', 'curveVertexRt', 'forward', 'left', 'moveTo',
	'quadraticVertex', 'right', 'turn', 'vertex', 'vertexRt'
]);

// some functions indicate that shapes are started and ended explicitly.
// If some code is explicitly starting and ending shapes very nearby,
// this module shouldn't be assuming that other neighbouring code is implicitly starting and ending them.
const uninterestingNames = new Set([
	'beginShape', 'endShape'
]);

export { pathFunctionNames, pathInteruptingNames, uninterestingNames };

function funcCallToName(token) {
	if (token.type !== ParseTreeTokenType.FUNC_CALL)
		return false;

	const firstChild = token.children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	return firstChild.val;
}

/*
This is only a very rough and superficial check to see if the specified token corresponds with code that
is likely executing after a shape is started.
It can return a false positive or a false negative but this is tested to 
work well for several cases and be a help on average.

This could be made correct in a wider variety of cases by handling if, if-else, repeat... with 
more code but that extra code doesn't seem worth the benefits right now.
*/
function isLikelyInShape(token) {
	if (token.parentNode === null)
		return false;
	let parent;
	while (token.parentNode !== null) {
		parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CODE_BLOCK ||
		parent.type === ParseTreeTokenType.TREE_ROOT)
			break;
		
		token = parent;
	}
	parent = token.parentNode;
	const children = parent.children;
	for (let index = children.indexOf(token) - 1; index >= 0; index--) {
		const tok = children[index];
		if (tok.type !== ParseTreeTokenType.DEF &&
		tok.type !== ParseTreeTokenType.CLASS) {
			const names = new Set(getDescendentsOfType(tok, ParseTreeTokenType.FUNC_CALL).map(funcCallToName).
				filter(name => name === 'beginShape' || name === 'endShape'));
			if (names.has('beginShape'))
				return true;
			if (names.has('endShape'))
				return false;
		}
	}
	return false;
}

function isContainedIn(token, excludedContainerTokens) {
	while (token !== null) {
		if (excludedContainerTokens.has(token))
			return true;
		token = token.parentNode;
	}
	return false;
}

function isOfInterest(excludedContainerTokens) {
	excludedContainerTokens = new Set(excludedContainerTokens);
	return function(token) {
		if (isContainedIn(token, excludedContainerTokens))
			return false;
		if (isLikelyInShape(token))
			return false;

		const children = token.children;
		for (const child of token.children) {
			if (child.type !== ParseTreeTokenType.DEF &&
			child.type !== ParseTreeTokenType.CLASS) {
				if (getDescendentsOfType(child, ParseTreeTokenType.FUNC_CALL).
				some(t => uninterestingNames.has(funcCallToName(t))))
					return false;
			}
		}
		return true;
	};
}

function isPathDrawingCall(funcCall) {
	const name = funcCallToName(funcCall);
	if (!pathFunctionNames.has(name))
		return false;
	if (name === 'right' || name === 'left') {
		const argList = funcCall.children[1];
		if (argList === undefined)
			return false;
		const children = filterBracketsAndCommas(argList.children);
		return children.length === 2;
	}
	return true;
}

function getShapePathLength(startIndex, children) {
	let i;
	let pathCount = 0;
	for (i = startIndex; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.DEF &&
		child.type !== ParseTreeTokenType.CLASS) {
			const calls = getDescendentsOfType(child, ParseTreeTokenType.FUNC_CALL);
			if (calls.some(c => pathInteruptingNames.has(funcCallToName(c)))) {
				break;
			}
			if (calls.some(isPathDrawingCall)) {
				pathCount++;
			}
		}
		if (child.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			break;
	}
	if (pathCount >= 3)
		return i - startIndex;
}

function createFunctionCall(name, token) {
	const result = new ParseTreeToken(null, token.lineIndex, token.colIndex,
		ParseTreeTokenType.FUNC_CALL);
	const identifier = new ParseTreeToken(name, token.lineIndex, token.colIndex,
		ParseTreeTokenType.IDENTIFIER);
	const argList = new ParseTreeToken(null, token.lineIndex, token.colIndex,
		ParseTreeTokenType.ARG_LIST);
	const leftBracket = new ParseTreeToken('(', token.lineIndex, token.colIndex,
		ParseTreeTokenType.CURVED_LEFT_BRACKET);
	const rightBracket = new ParseTreeToken(')', token.lineIndex, token.colIndex,
		ParseTreeTokenType.CURVED_RIGHT_BRACKET);
	argList.appendChild(leftBracket);
	argList.appendChild(rightBracket);
	result.appendChild(identifier);
	result.appendChild(argList);
	return result;
}

export function insertBeginEndShape(root) {
	const polies = getDescendentsOfType(root, ParseTreeTokenType.FUNC_CALL).filter(shouldBeWrappedInPoly);
	const blocks = getDescendentsOfTypes(root, [
		ParseTreeTokenType.CODE_BLOCK,
		ParseTreeTokenType.TREE_ROOT]).filter(isOfInterest(polies));
	let somethingInserted = false;
	blocks.forEach(function(block) {
		for (let i = 0; i < block.children.length; i++) {
			const length = getShapePathLength(i, block.children);
			if (length !== undefined) {
				let child = block.children[i];
				child.appendPreviousSibling(createFunctionCall('beginShape', child));
				child = block.children[i + length];
				child.appendSibling(createFunctionCall('endShape', child));
				i += length;
				somethingInserted = true;
			}
		}
	});

	return somethingInserted;
};