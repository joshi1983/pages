import { createEmptyArgList } from './createArgList.js';
import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { getClosestOfTypes } from
'../../generic-parsing-utilities/getClosestOfTypes.js';
import { isCompleteCodeBlockToken } from
'./isCompleteCodeBlockToken.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../QBasicInternalFunctions.js';

const compositeFunctionNames = [];
QBasicInternalFunctions.getAllFunctionsInfo().forEach(function(info) {
	if (info.primaryName.indexOf(' ') !== -1) {
		compositeFunctionNames.push(info.primaryName.split(' ').map(name => name.toLowerCase()));
	}
});

const goodSubroutinePreviousTypes = new Set([
	ParseTreeTokenType.CALL,
	ParseTreeTokenType.CODE_BLOCK
]);

const badLastChildTypesForArgList = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);
const badPreviousTypes = new Set([
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.LOOP_WHILE
]);

const badParentPreviousTypes = new Set([
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SUB
]);

const nonFCPairs = new Set([
'open-append', 'open-binary', 'open-input',
'open-output', 'open-random'
]);

function isSpecialFunctionChild(fCall, name) {
	if (fCall.type !== ParseTreeTokenType.FUNCTION_CALL ||
	fCall.children.length < 2)
		return false;
	const nameToken = fCall.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const key = `${nameToken.val.toLowerCase()}-${name.toLowerCase()}`;
	return nonFCPairs.has(key);
}

function isGoodPrevious(token, next) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (badParentPreviousTypes.has(parent.type))
		return false;
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.ARG_LIST) {
		if (lastChild !== undefined) {
			if (lastChild.type === ParseTreeTokenType.IDENTIFIER &&
			lastChild.val.toLowerCase() === 'for')
				return true;
			if (badLastChildTypesForArgList.has(lastChild.type))
				return false;
			if (lastChild.lineIndex !== next.lineIndex)
				return false;
		}
		else {
			if (next.lineIndex !== token.lineIndex) {
				const firstChild = token.parentNode.children[0];
				if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
					const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val);
					if (info !== undefined && (info.args !== undefined || info.argCount !== undefined)) {
						if ((info.argCount !== undefined && info.argCount.min === 0) ||
						(info.args !== undefined && info.args.length === 0))
							return false;
					}
				}
			}
		}
	}
	if (isCompleteCodeBlockToken(token, next))
		return false;
	if (token.type === ParseTreeTokenType.AS &&
	children.length >= 1)
		return false;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT)
		return token.children.length < 2;
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && lastChild !== undefined) {
		if (lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return false;
		else
			return true;
	}
	if (token.type === ParseTreeTokenType.DIM && lastChild !== undefined) {
		if (lastChild.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
		lastChild.type === ParseTreeTokenType.TUPLE_LITERAL)
			return false;
		if (lastChild.type === ParseTreeTokenType.IDENTIFIER &&
		lastChild.lineIndex !== next.lineIndex)
			return false;
	}
	if (token.type === ParseTreeTokenType.DO) {
		return lastChild === undefined;
	}
	if (token.type === ParseTreeTokenType.FOR) {
		return lastChild === undefined;
	}
	if (token.type === ParseTreeTokenType.IF) {
		if (lastChild !== undefined &&
		(lastChild.type === ParseTreeTokenType.CODE_BLOCK ||
		lastChild.type === ParseTreeTokenType.END ||
		lastChild.type === ParseTreeTokenType.IF ||
		lastChild.type === ParseTreeTokenType.END_IF))
			return false;
	}
	if (token.type === ParseTreeTokenType.NEXT) {
		if (children.length !== 0)
			return false;
		return token.lineIndex === next.lineIndex;
	}
	if (token.type === ParseTreeTokenType.TYPE_PROPERTY &&
	children.length >= 1)
		return false;
	if (token.type === ParseTreeTokenType.UNTIL) {
		return children.length === 0;
	}
	if (token.type === ParseTreeTokenType.WHILE) {
		if (parent.type === ParseTreeTokenType.LOOP_WHILE &&
		children.length === 1)
			return false;
	}
	return !badPreviousTypes.has(token.type);
}

function getGoodPrevious(token, next) {
	while (!isGoodPrevious(token, next))
		token = token.parentNode;
	return token;
}

function shouldBeCompositeIdentifier(prev, name) {
	if (prev.type === ParseTreeTokenType.ARG_LIST)
		prev = prev.getPreviousSibling();
	if (prev === null || prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const prevName = prev.val.toLowerCase();
	name = name.toLowerCase();
	for (const cNames of compositeFunctionNames) {
		for (let i = 1; i < cNames.length; i++) {
			if (cNames[i - 1] === prevName && cNames[i] === name)
				return true;
		}
	}
	return false;
}

function shouldBeFunctionCall(name, functionsMap, prev) {
	if (prev.type === ParseTreeTokenType.DEF ||
	prev.type === ParseTreeTokenType.FUNCTION ||
	prev.type === ParseTreeTokenType.SUB)
		return false;
	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.ARG_LIST &&
	parent !== null) {
		if (isSpecialFunctionChild(parent, name)) {
			return false;
		}
		if (parent.type === ParseTreeTokenType.FUNCTION ||
		parent.type === ParseTreeTokenType.SUB)
			return false;
	}
	name = name.toLowerCase();
	const containingSubOrFunction = getClosestOfTypes(prev, [
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.SUB
	]);
	if (containingSubOrFunction !== null) {
		const children = containingSubOrFunction.children;
		const nameToken = children[0];
		if (nameToken.val !== null && nameToken.val.toLowerCase() === name)
			return false;
	}
	if (QBasicInternalFunctions.getFunctionInfo(name, functionsMap) !== undefined)
		return true;
	const funcDefinitionToken = getClosestOfType(prev, ParseTreeTokenType.FUNCTION);
	if (funcDefinitionToken !== null) {
		const firstChild = funcDefinitionToken.children[0];
		if (firstChild !== undefined && firstChild.val !== null &&
		firstChild.val.toLowerCase() === name)
			return false;
	}
	return functionsMap.has(name);
}

function isGoodPreviousForSubroutineCall(token) {
	if (token.parentNode === null)
		return true;
	return goodSubroutinePreviousTypes.has(token.type);
}

function getGoodPreviousForSubroutineCall(token) {
	while (!isGoodPreviousForSubroutineCall(token))
		token = token.parentNode;
	return token;
}

function convertToCompositeIdentifier(prev, next) {
	const oldPrev = prev;
	if (prev.type === ParseTreeTokenType.ARG_LIST)
		prev = prev.getPreviousSibling();
	const composite = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
		ParseTreeTokenType.COMPOSITE_IDENTIFIER);
	prev.parentNode.replaceChild(prev, composite);
	composite.appendChild(prev);
	composite.appendChild(next);
	if (oldPrev.type === ParseTreeTokenType.ARG_LIST)
		return oldPrev;
	else
		return next;
}

function convertToFunctionCall(prev, next, functionsMap) {
	const info = QBasicInternalFunctions.getFunctionInfo(next.val.toLowerCase(), functionsMap);
	if (info !== undefined && info.returnTypes === null)
		prev = getGoodPreviousForSubroutineCall(prev);
	const funcCall = new ParseTreeToken(null,
		next.lineIndex, next.colIndex,
		ParseTreeTokenType.FUNCTION_CALL);
	prev.appendChild(funcCall);
	funcCall.appendChild(next);
	const argList = new ParseTreeToken(null,
		next.lineIndex, next.colIndex,
		ParseTreeTokenType.ARG_LIST);
	funcCall.appendChild(argList);
	return argList;
}

function shouldBeTypeProperty(prev) {
	if (prev.type !== ParseTreeTokenType.TYPE)
		return false;

	return prev.children.length !== 0;
}

function shouldAddArgList(prev) {
	return prev.type === ParseTreeTokenType.DEF ||
		prev.type === ParseTreeTokenType.FUNCTION ||
		prev.type === ParseTreeTokenType.SUB;
}

export function processIdentifier(prev, next, functionsMap) {
	prev = getGoodPrevious(prev, next);
	if (shouldBeCompositeIdentifier(prev, next.val)) {
		return convertToCompositeIdentifier(prev, next);
	}
	else if (shouldBeFunctionCall(next.val, functionsMap, prev)) {
		return convertToFunctionCall(prev, next, functionsMap);
	}
	if (shouldBeTypeProperty(prev)) {
		const typeProperty = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.TYPE_PROPERTY);
		prev.appendChild(typeProperty);
		typeProperty.appendChild(next);
		return typeProperty;
	}
	prev.appendChild(next);
	if (shouldAddArgList(prev)) {
		const argList = createEmptyArgList({
			'lineIndex': next.lineIndex,
			'colIndex': next.colIndex + 1
			// make sure the arg list is after the identifier when tokens are sorted.
		});
		prev.appendChild(argList);
		return argList;
	}

	return next;
};