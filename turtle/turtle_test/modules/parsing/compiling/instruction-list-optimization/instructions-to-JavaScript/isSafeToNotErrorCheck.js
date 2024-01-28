import { evaluateLiteralToken } from '../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { parse } from '../../../js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../js-parsing/ParseTreeTokenType.js';

function isThrowingError(inValue, errorCheckFunction) {
	try {
		errorCheckFunction(inValue);
	}
	catch (e) {
		return true;
	}
}

export function isSafeToNotErrorCheck(jsCode, errorCheckFunction) {
	const parseResult = parse(jsCode);
	const root = parseResult.root;
	if (root.children.length !== 1)
		return false;
	const onlyChild = root.children[0];
	let inValue = evaluateLiteralToken(onlyChild);
	if (inValue === undefined)
		return false;
	return !isThrowingError(inValue, errorCheckFunction);
};