import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getLastDescendentTokenOf } from '../../../../parsing/parse-tree-token/getLastDescendentTokenOf.js';
import { Operators } from '../../../../parsing/Operators.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Operators.asyncInit();

const symbolConversions = new Map();
['+', '*'].forEach(function(symbol) {
	const info = Operators.getOperatorInfo(symbol);
	if (typeof info.similarCommand !== 'string')
		throw new Error(`Serious internal problem: expected similarCommand to be a string but got ${info.similarCommand} for operator symbol ${symbol}`);
	symbolConversions.set(symbol, info.similarCommand);
});

function isBinaryOperatorOfInterest(token) {
	if (!symbolConversions.has(token.val) ||
		token.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) 
		return false;
	if (token.children.length === 2 && token.children[0].val === '(') {
		if (token.parentNode.children.indexOf(token) !== 0)
			return false;
		if (token.parentNode.children.length < 3)
			return false;
		return true;
	}
	return false;
}

function tryRefactoringBinaryOperator(cachedParseTree, operatorToken, fixLogger) {
	const curvedBracketToken = operatorToken.parentNode;
	if (curvedBracketToken.children.length === 3) {
		const bracketSymbolToken = operatorToken.children[0];
		const firstOperand = operatorToken.children[1];
		const secondOperand = curvedBracketToken.children[1];
		const firstOperandLastToken = getLastDescendentTokenOf(firstOperand);
		if (firstOperand.children.length === 0) {
			// put no space between ( bracket and first operand.
			firstOperand.lineIndex = bracketSymbolToken.lineIndex;
			firstOperand.colIndex = bracketSymbolToken.colIndex + 1;
		}
		else {
			// try to move every token to the left by 1 column index.
			// This is to make more space for after the new operator position.
			const tokens = getAllDescendentsAsArray(firstOperand);
			tokens.forEach(function(token) {
				if (token.colIndex > 0)
					token.colIndex--;
			});
		}
		operatorToken.lineIndex = firstOperandLastToken.lineIndex;
		operatorToken.colIndex = firstOperandLastToken.colIndex + 1;
		bracketSymbolToken.remove(); // remove from operator parent so it can be added to the 
		curvedBracketToken.prependChild(bracketSymbolToken);
		secondOperand.remove(); // remove from curved backet expression parent
		operatorToken.appendChild(secondOperand);

		fixLogger.log(`Moved operator ${operatorToken.val} between operands because Polish notation is not allowed for binary operators in WebLogo`, operatorToken);
		return true;
	}
	return false;
}

function convertToCommand(cachedParseTree, operatorToken, fixLogger) {
	const oldVal = operatorToken.val;
	const commandName = symbolConversions.get(operatorToken.val);
	operatorToken.val = commandName;
	operatorToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
	const curvedBracketExpressionToken = operatorToken.parentNode;
	
	// move '(' token to become direct child of the curved bracket expression, if needed.
	if (operatorToken.children[0].val === '(') {
		const bracketOnlyToken = operatorToken.children[0];
		bracketOnlyToken.remove();
		curvedBracketExpressionToken.prependChild(bracketOnlyToken);
	}

	// Any non-bracket tokens after the new command call should become children of operatorToken
	// to represent parameters to the new command call
	while (curvedBracketExpressionToken.children.length > 3) {
		const tokenToMove = curvedBracketExpressionToken.children[2];
		tokenToMove.remove();
		operatorToken.appendChild(tokenToMove);
	}

	cachedParseTree.tokenValueChanged(operatorToken, oldVal);
	cachedParseTree.tokenTypeChanged(operatorToken, ParseTreeTokenType.BINARY_OPERATOR);
	fixLogger.log(`Replaced operator symbol ${oldVal} with the command ${commandName} because Polish notation is not allowed for operator symbols in WebLogo`, operatorToken);
}

export function polishNotationFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.BINARY_OPERATOR).
		filter(isBinaryOperatorOfInterest);
	if (tokens.length === 0)
		return; // nothing to do.

	tokens.forEach(function(operatorToken) {
		if (!tryRefactoringBinaryOperator(cachedParseTree, operatorToken, fixLogger)) {
			convertToCommand(cachedParseTree, operatorToken, fixLogger);
		}
	});
};