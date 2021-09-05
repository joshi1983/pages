import { evaluateLiteralToken } from
'../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { filterBracketsAndCommas } from
'../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isNumber } from
'../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../js-parsing/ParseTreeTokenType.js';

const replacementsMap = new Map([
	['pow', [
		{
			'condition': {
				'firstVal': Math.E
			},
			'to': 'exp'
		},
		{
			'condition': {
				'secondVal': 1/2
			},
			'to': 'sqrt'
		},
		{
			'condition': {
				'secondVal': 1/3
			},
			'to': 'cbrt'
		}
	]]
]);
const errorThreshold = 0.0000001;

function isMatchFor(argumentTokens) {
	const argumentVals = argumentTokens.map(evaluateLiteralToken);
	return function(replacementInfo) {
		const conditionInfo = replacementInfo.condition;
		if (isNumber(conditionInfo.firstVal) && (
		!isNumber(argumentVals[0]) ||
		Math.abs(argumentVals[0] - conditionInfo.firstVal) > errorThreshold)) {
			return false;
		}
		if (isNumber(conditionInfo.secondVal) && (
		!isNumber(argumentVals[1]) ||
		Math.abs(argumentVals[1] - conditionInfo.secondVal) > errorThreshold)) {
			return false;
		}
		return true;
	};
}

function processReplacement(call, info) {
	const renamedToken = call.children[0].children[0].children[0];
	renamedToken.val = info.to;
	const condition = info.condition;
	const argumentTokens = filterBracketsAndCommas(call.children[1].children);
	if (isNumber(condition.firstVal)) {
		const first = argumentTokens[0];
		const next = first.getNextSibling();
		if (next.type === ParseTreeTokenType.COMMA)
			next.remove();
		first.remove();
	}
	if (isNumber(condition.secondVal)) {
		const second = argumentTokens[1];
		const previous = second.getPreviousSibling();
		const next = second.getNextSibling();
		if (previous.type === ParseTreeTokenType.COMMA)
			previous.remove();
		if (next.type === ParseTreeTokenType.COMMA)
			next.remove();
		second.remove();
	}
}

function getReplacementInfoFor(callToken) {
	if (callToken.children.length !== 2)
		return false;

	const firstChild = callToken.children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.children.length !== 1 ||
	firstChild.val !== 'Math')
		return;
	
	const dotChild = firstChild.children[0];
	if (dotChild.val !== '.' ||
	dotChild.type !== ParseTreeTokenType.DOT ||
	dotChild.children.length !== 1)
		return;

	const methodNameToken = dotChild.children[0];
	if (methodNameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	methodNameToken.children.length !== 0)
		return;

	let candidates = replacementsMap.get(methodNameToken.val);
	if (candidates === undefined)
		return;

	const argList = callToken.children[1];
	const argumentValues = filterBracketsAndCommas(argList.children);
	candidates = candidates.filter(isMatchFor(argumentValues));
	return candidates[0];
}

function isOfInterest(token) {
	return getReplacementInfoFor(token) !== undefined;
}

export function useFasterMathFunctions(root) {
	const calls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).filter(isOfInterest);
	let result = false;
	calls.forEach(function(call) {
		const info = getReplacementInfoFor(call);
		if (info !== undefined) {
			processReplacement(call, info);
			result = true;
		}
	});
	return result;
};