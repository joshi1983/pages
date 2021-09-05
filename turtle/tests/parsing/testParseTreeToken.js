import { Token } from '../../modules/parsing/Token.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
await LogoParser.asyncInit();
await ParseTreeToken.asyncInit();

function checkTok1Tok2Tok2(token1, token2, token3, logger) {
	if (token3.nextSibling !== null)
		logger(`Expected token3.nextSibling to be null but got ${token3.nextSibling}`);
	if (token3.previousSibling.val !== 'tok2')
		logger(`Expected token3.previousSibling.val to be tok2 but got ${token3.previousSibling.val}`);
	if (token2.previousSibling.val !== 'tok1')
		logger(`Expected token2.previousSibling.val to be tok1 but got ${token2.previousSibling.val}`);
	if (token1.previousSibling !== null)
		logger(`Expected token1.previousSibling to be null but got ${token1.previousSibling}`);
	if (token1.nextSibling.val !== 'tok2')
		logger(`Expected token1.nextSibling.val to be tok2 but got ${token1.nextSibling.val}`);
	if (token2.nextSibling.val !== 'tok3')
		logger(`Expected token2.nextSibling.val to be tok3 but got ${token2.nextSibling.val}`);
}

function testAppendChild(logger) {
	const token = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST);
	if (token.getDepth() !== 0)
		logger('Expected depth of 0 but got ' + token.getDepth());
	if (token.children.length !== 0)
		logger('Expected 0 children but got ' + token.children.length);
	const newChild = new ParseTreeToken('print', null, 0, 0, ParseTreeTokenType.LEAF);
	token.appendChild(newChild);
	if (token.getDepth() !== 0)
		logger('Expected depth of 0 but got ' + token.getDepth());
	if (newChild.getDepth() !== 1)
		logger('Expected depth of 1 but got ' + newChild.getDepth());
	if (token.children.length !== 1)
		logger('Expected 1 child but got ' + token.children.length);
	const secondChild = new ParseTreeToken('yo', null, 0, 0, ParseTreeTokenType.STRING_LITERAL);
	newChild.appendSibling(secondChild);
	if (secondChild.getDepth() !== 1)
		logger('second child should have depth 1 but got ' + secondChild.getDepth());
	if (token.children.length !== 2)
		logger('Expected 2 children but got ' + token.children.length);
	if (token.children[0].type !== ParseTreeTokenType.LEAF)
		logger('Expected first child to be a leaf but got ' + token.children[0].type);
	if (token.children[1].type !== ParseTreeTokenType.STRING_LITERAL)
		logger('Expected second child to be a STRING_LITERAL but got ' + token.children[1].type);
	const thirdChild = new ParseTreeToken('cs', null, 0, 0, ParseTreeTokenType.LEAF);
	token.appendChild(thirdChild);
	if (token.children.length !== 3)
		logger('Expected 3 children but got ' + token.children.length);
	if (token.children[0].type !== ParseTreeTokenType.LEAF)
		logger('After appending third child, expected first child to be a leaf but got ' + token.children[0].type);
	if (token.children[1].type !== ParseTreeTokenType.STRING_LITERAL)
		logger('After appending third child, expected second child to be a STRING_LITERAL but got ' + token.children[1].type);
	if (token.children[2].type !== ParseTreeTokenType.LEAF)
		logger('After appending third child, expected third child to be a LEAF but got ' + token.children[2].type);
}

function testAppendChild2(logger) {
	const parentToken = new ParseTreeToken('parentToken', null, 0, 0, ParseTreeTokenType.LEAF);
	const token1 = new ParseTreeToken('tok1', null, 0, 0, ParseTreeTokenType.LEAF);
	const token2 = new ParseTreeToken('tok2', null, 0, 0, ParseTreeTokenType.LEAF);
	const token3 = new ParseTreeToken('tok3', null, 0, 0, ParseTreeTokenType.LEAF);
	parentToken.appendChild(token1);
	parentToken.appendChild(token2);
	parentToken.appendChild(token3);
	checkTok1Tok2Tok2(token1, token2, token3, logger);
}

function testAppendPreviousSibling(logger) {
	const parentNode = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	const token = new ParseTreeToken('clearscreen', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	parentNode.appendChild(token);
	if (parentNode.children.length !== 1)
		logger('children length expected to be 1 but got ' + parentNode.children.length);
	const newSibling = new ParseTreeToken('hideTurtle', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	token.appendPreviousSibling(newSibling);
	if (newSibling.nextSibling !== token)
		logger('newSibling.nextSibling should be token but it is not.');
	if (token.previousSibling !== newSibling)
		logger('token.previousSibling should be newSibling but it is not');
	if (newSibling.parentNode !== parentNode)
		logger('newSibling.parentNode should be parentNode but it is not');
	if (token.nextSibling !== null)
		logger('token.nextSibling should be null but it is not');
	if (parentNode.children.length !== 2)
		logger('children length expected to be 2 but got ' + parentNode.children.length);
}

function testAppendPreviousSibling2(logger) {
	const token1 = new ParseTreeToken('tok1', null, 0, 0, ParseTreeTokenType.LEAF);
	const token2 = new ParseTreeToken('tok2', null, 0, 0, ParseTreeTokenType.LEAF);
	const token3 = new ParseTreeToken('tok3', null, 0, 0, ParseTreeTokenType.LEAF);
	token3.appendPreviousSibling(token1);
	token3.appendPreviousSibling(token2);
	checkTok1Tok2Tok2(token1, token2, token3, logger);
}

function testAppendSibling(logger) {
	const token = new ParseTreeToken('clearscreen', null, 0, 0, ParseTreeTokenType.LEAF);
	const newSibling = new ParseTreeToken('print', null, 0, 0, ParseTreeTokenType.LEAF);
	if (token.nextSibling !== null)
		logger('nextSibling expected to be null');
	if (token.previousSibling !== null)
		logger('previousSibling expected to be null');
	if (newSibling.parentNode !== null)
		logger('newSibling.parentNode expected to be null');
	token.appendSibling(newSibling);
	if (token.nextSibling !== newSibling)
		logger('nextSibling expected to be newSibling');
	if (newSibling.previousSibling !== token)
		logger('newSibling.previousSibling expected to be token');
	if (newSibling.parentNode !== null)
		logger('newSibling.parentNode expected to be null');
	const parentNode = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	parentNode.appendChild(token);
	if (token.parentNode !== parentNode)
		logger('parentNode expected to be parentNode');
	if (token.nextSibling !== null)
		logger('appendChild expected to remove the nextSibling for the new child node');
	if (parentNode.children.length !== 1)
		logger('parentNode expected to have 1 child');
	parentNode.appendSibling(newSibling);
	if (parentNode.children.length !== 1)
		logger('After parentNode.appendSibling, parentNode expected to have 1 child');	
}

function testAppendSibling2(logger) {
	const token1 = new ParseTreeToken('tok1', null, 0, 0, ParseTreeTokenType.LEAF);
	const token2 = new ParseTreeToken('tok2', null, 0, 0, ParseTreeTokenType.LEAF);
	const token3 = new ParseTreeToken('tok3', null, 0, 0, ParseTreeTokenType.LEAF);
	token1.appendSibling(token3);
	token1.appendSibling(token2);
	checkTok1Tok2Tok2(token1, token2, token3, logger);
}

function testCreateFromScannedToken(logger) {
	const cases = [
		{"in": "square", "type": ParseTreeTokenType.LEAF, "str": "square"},
		{"in": "\n", "type": ParseTreeTokenType.NEW_LINE, "str": "\n"},
		{"in": "3", "type": ParseTreeTokenType.NUMBER_LITERAL, "str": "3"},
		{"in": "\"x", "type": ParseTreeTokenType.STRING_LITERAL, "str": "\"x"},
		{"in": ":x", "type": ParseTreeTokenType.VARIABLE_READ, "str": ":x"},
		{"in": "to", "type": ParseTreeTokenType.PROCEDURE_START_KEYWORD, "str": "to"},
		{"in": "TO", "type": ParseTreeTokenType.PROCEDURE_START_KEYWORD, "str": "TO"},
		{"in": "end", "type": ParseTreeTokenType.PROCEDURE_END_KEYWORD, "str": "end"},
		{"in": "*", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "*"},
		{"in": "-", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "-"},
		{"in": "+", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "+"},
		{"in": "=", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "="},
		{"in": "<", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "<"},
		{"in": ">", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": ">"},
		{"in": "<=", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": "<="},
		{"in": ">=", "type": ParseTreeTokenType.BINARY_OPERATOR, "str": ">="},
		{"in": "true", "type": ParseTreeTokenType.BOOLEAN_LITERAL, "str": "true"},
		{"in": "false", "type": ParseTreeTokenType.BOOLEAN_LITERAL, "str": "false"},
		{"in": "TRUE", "type": ParseTreeTokenType.BOOLEAN_LITERAL, "str": "TRUE"},
		{"in": "False", "type": ParseTreeTokenType.BOOLEAN_LITERAL, "str": "False"},
		{"in": "; hello world", "type": ParseTreeTokenType.COMMENT, "str": "; hello world"},
		{"in": "\"Hello", "type": ParseTreeTokenType.STRING_LITERAL, "str": "\"Hello"},
		{"in": "'hello World'", "type": ParseTreeTokenType.LONG_STRING_LITERAL, "str": "'hello World'"},
		{"in": "'('", "type": ParseTreeTokenType.LONG_STRING_LITERAL, "str": "'('"},
		{"in": "'['", "type": ParseTreeTokenType.LONG_STRING_LITERAL, "str": "'['"},
		{"in": "~", "type": ParseTreeTokenType.LEAF, "str": "~"},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, input "${caseInfo.in}"`, logger);
		const token = new Token(caseInfo.in, 0, 0);
		const impossibleTypes = new Set();
		const result = ParseTreeToken.createFromScannedToken(token, impossibleTypes);
		if (result.type !== caseInfo.type)
			plogger('Expected type ' + ParseTreeTokenType.getNameFor(caseInfo.type) + ' but got ' + ParseTreeTokenType.getNameFor(result.type));
		if (result.toString() !== caseInfo.str)
			plogger('Expected ' + caseInfo.str + ' but got ' + result.toString());
	});
}

function testFlatten(logger) {
	const cases = [
		{'code': 'fd 100', 'numTokensWithoutRoot': 2},
		{'code': 'fd 100 + :x', 'numTokensWithoutRoot': 4},
		{'code': 'make "x 1\nfd :x', 'numTokensWithoutRoot': 5}
	];
	cases.forEach(function(caseInfo, index) {
		const testLogger = new TestParseLogger(logger, caseInfo.code);
		const sourceTokens = LogoParser.getParseTree(caseInfo.code, testLogger);
		const flattenedTokens = ParseTreeToken.flatten(sourceTokens).filter(function(token) {
			return token.type !== ParseTreeTokenType.TREE_ROOT;
		});
		if (flattenedTokens.length !== caseInfo.numTokensWithoutRoot)
			logger('Expected ' + caseInfo.numTokensWithoutRoot +
				' flattened tokens but got ' + flattenedTokens.length);
	});
}

function testIncompleteLongStringToString(logger) {
	const token = new ParseTreeToken("hi", null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL, "hi");
	token.isComplete = false;
	const result = token.toString();
	const expected = '\'hi';
	if (result !== expected)
		logger(`Expected ${expected} but got ${result}`);
}

function testIsBracket(logger) {
	const cases = [
	{'val': '(', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'result': false},
	{'val': ')', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'result': false},
	{'val': '[', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'result': false},
	{'val': ']', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'result': false},
	{'val': '(', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': false},
	{'val': ')', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': false},
	{'val': '[', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': false},
	{'val': ']', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': false},
	{'val': '(', 'type': ParseTreeTokenType.LEAF, 'result': true},
	{'val': ')', 'type': ParseTreeTokenType.LEAF, 'result': true},
	{'val': '[', 'type': ParseTreeTokenType.LEAF, 'result': true},
	{'val': ']', 'type': ParseTreeTokenType.LEAF, 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const token = new ParseTreeToken(caseInfo.val, null, 0, 0, caseInfo.type);
		const result = token.isBracket();
		if (result !== caseInfo.result) {
			logger(`Case ${index}, result expected to be ${caseInfo.result} but got ${result}`);
		}
	});
}

function testRemoveChild(logger) {
	const parentToken = new ParseTreeToken('setProperty', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const firstChildToken = new ParseTreeToken('', null, 0, 0, ParseTreeTokenType.VARIABLE_READ);
	const secondChildToken = new ParseTreeToken('x', null, 0, 0, ParseTreeTokenType.LEAF);
	const thirdChildToken = new ParseTreeToken('pos', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	parentToken.appendChild(firstChildToken);
	if (parentToken.children.length !== 1)
		logger(`Expected 1 child but found ${parentToken.children.length}`);
	parentToken.appendChild(secondChildToken);
	if (parentToken.children.length !== 2)
		logger(`Expected 2 children but found ${parentToken.children.length}`);
	parentToken.appendChild(thirdChildToken);
	if (parentToken.children.length !== 3)
		logger(`Expected 3 children but found ${parentToken.children.length}`);
	parentToken.removeChild(firstChildToken);
	if (parentToken.children.length !== 2)
		logger(`After removeChild(firstChildToken), expected 2 children but found ${parentToken.children.length}`);
	if (parentToken.children[0] === firstChildToken)
		logger('After removeChild(firstChildToken), parentToken.children[0] should not still be firstChild but it is.');
	if (parentToken.children[0] !== secondChildToken)
		logger('After removeChild(firstChildToken), parentToken.children[0] should be secondChild but it is not.');
	if (parentToken.children[1] !== thirdChildToken)
		logger('After removeChild(firstChildToken), parentToken.children[1] should be thirdChild but it is not.');
}

function testReplaceChild(logger) {
	const token = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	const child0 = new ParseTreeToken('(', null, 0, 0, ParseTreeTokenType.LEAF);
	const child1 = new ParseTreeToken(1, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
	const child2 = new ParseTreeToken(')', null, 0, 0, ParseTreeTokenType.LEAF);
	token.appendChild(child0);
	token.appendChild(child1);
	token.appendChild(child2);
	if (token.children.length !== 3)
		logger('Expected to have 3 children');
	const newChild = new ParseTreeToken(2, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
	token.replaceChild(child1, newChild);
	if (token.children.length !== 3)
		logger('After replaceChild, expected to have 3 children');
	if (child0.nextSibling !== newChild)
		logger('child0.nextSibling expected to be newChild');
	if (child0.previousSibling !== null)
		logger('child0.nextSibling expected to be null');
	if (child2.previousSibling !== newChild)
		logger('child2.previousSibling expected to be newChild');
	if (newChild.previousSibling !== child0)
		logger('newChild.previousSibling expected to be child0');
	if (newChild.nextSibling !== child2)
		logger('newChild.nextSibling expected to be child2');
	if (newChild.parentNode !== token)
		logger('newChild.parentNode expected to be token');
	const child0Replacement = new ParseTreeToken('[', null, 0, 0, ParseTreeTokenType.LEAF);
	token.replaceChild(child0, child0Replacement);
	if (token.children.length !== 3)
		logger('After child0 replaceChild, expected to have 3 children');
	if (token.children[0] !== child0Replacement)
		logger('After child0 replaceChild, expected first child to be child0Replacement');
	if (child0Replacement.previousSibling !== null)
		logger('Expected child0Replacement.previousSibling to be null');
	if (child0Replacement.nextSibling !== newChild)
		logger('Expected child0Replacement.nextSibling to be newChild');
	if (newChild.previousSibling !== child0Replacement)
		logger('Expected newChild.previousSibling to be child0Replacement');
}

function testToString(logger) {
	const incompleteLongStringToken = new ParseTreeToken("hi", null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL);
	incompleteLongStringToken.isComplete = false;
	const cases = [
		{'token': new ParseTreeToken(5, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': '5'},
		{'token': new ParseTreeToken("hi", null, 0, 0, ParseTreeTokenType.STRING_LITERAL), 'result': '"hi'},
		{'token': new ParseTreeToken("hi", null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL), 'result': '\'hi\''},
		{'token': incompleteLongStringToken, 'result': '\'hi'},
	];
	cases.forEach(function(caseInfo) {
		const result = caseInfo.token.toString();
		if (result !== caseInfo.result)
			logger(`Expected "${caseInfo.result}" but got "${result}"`);
	});
}

export function testParseTreeToken(logger) {
	wrapAndCall([
		testAppendChild,
		testAppendChild2,
		testAppendPreviousSibling,
		testAppendPreviousSibling2,
		testAppendSibling,
		testAppendSibling2,
		testCreateFromScannedToken,
		testFlatten,
		testIncompleteLongStringToString,
		testIsBracket,
		testRemoveChild,
		testReplaceChild,
		testToString
	], logger);
}