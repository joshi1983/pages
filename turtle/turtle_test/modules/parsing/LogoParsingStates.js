import { Command } from './Command.js';
import { getProcedureStartToken } from './parse-tree-analysis/getProcedureStartToken.js';
import { NumberType } from './data-types/NumberType.js';
import { Operators } from './Operators.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

async function asyncInit() {
	await Operators.asyncInit();
	await Command.asyncInit();
}
const initPromise = asyncInit();

export class LogoParsingStates {
	static asyncInit() {
		return initPromise;
	}

	static canBeUnaryOperator(previousToken, tok, nextToken, nextTokenString) {
		if (tok.type !== ParseTreeTokenType.BINARY_OPERATOR && tok.type !== ParseTreeTokenType.UNARY_OPERATOR)
			return false;
		if (!Operators.canBeUnary(tok.val))
			return false;
		if (previousToken) {
			previousToken = previousToken.getLastToken();
			if (previousToken.val === '(' && previousToken.parentNode !== null &&
			previousToken.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
			previousToken.parentNode.children.indexOf(previousToken) === 0)
				return true;
			if (previousToken.val === '[' && previousToken.parentNode !== null &&
			previousToken.parentNode.type === ParseTreeTokenType.LIST &&
			previousToken.parentNode.children.indexOf(previousToken) === 0)
				return true;
			if ([ParseTreeTokenType.PARAMETERIZED_GROUP, ParseTreeTokenType.LEAF].indexOf(previousToken.type) !== -1) {
				const commandInfo = Command.getCommandInfo(previousToken.val);
				if (commandInfo !== undefined && Command.getArgCount(commandInfo).defaultCount !== 0)
					return true;
			}
			if (previousToken.colIndex === tok.colIndex - 1 && [
				ParseTreeTokenType.LIST, ParseTreeTokenType.STRING_LITERAL
			].indexOf(previousToken.type) === -1)
				return false;
		}
		// if tok can not output a number, return false.
		if (!nextToken || (NumberType.isDefinitelyNotCompatibleWith(nextToken) && nextToken.val !== '(' && nextToken.type !== ParseTreeTokenType.LEAF))
			return false;
		if (typeof nextToken === 'object' && nextToken.colIndex - nextTokenString.length !== tok.colIndex)
			return false;
		return true;
	}

	static isEndingBinaryOperatorExpression(tok) {
		if (tok === null || tok === undefined || tok.parentNode === null)
			return false;
		if (tok.parentNode.type === ParseTreeTokenType.UNARY_OPERATOR)
			return tok.parentNode.getChildCount() === 1;
		return tok.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR && tok.parentNode.getChildCount() === 2;
	}

	static isExpectingProcedureEndOrCommand(tok) {
		if (!tok || tok.parentNode === null)
			return false;
		const toToken = getProcedureStartToken(tok);
		if (toToken === undefined || toToken.children.length !== 3)
			return false;
		const commandListToken = toToken.children[2];
		return tok === commandListToken || commandListToken.children.indexOf(tok) !== -1;
	}

	static isExpectingProcedureName(tok) {
		return tok.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
		tok.getChildCount() === 0;
	}

	static isImmediatelyAfterProcedureParameterList(tok) {
		if (tok.type !== ParseTreeTokenType.LIST || tok.previousSibling === null ||
		tok.previousSibling.type !== ParseTreeTokenType.LIST ||
		tok.children.length !== 0 ||
		tok.parentNode === null ||
		tok.parentNode.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return false;
		return true;
	}

	static getImpossibleTypes(tok) {
		const result = new Set();
		if (tok === undefined || tok === null)
			return result;
		if (tok.doesAnyAncestorHaveType(ParseTreeTokenType.PROCEDURE_START_KEYWORD)||
		tok.getDepth() > 0) {
			result.add(ParseTreeTokenType.PROCEDURE_START_KEYWORD);
		}
		if (!tok.doesAnyAncestorHaveType(ParseTreeTokenType.PROCEDURE_START_KEYWORD) ||
		tok.doesAnyAncestorHaveType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)||
		tok.getDepth() > 4) {
			result.add(ParseTreeTokenType.PROCEDURE_END_KEYWORD);
		}
		return result;
	}

	static isInProcedureParameterList(tok) {
		var paramListToken = tok;
		if (tok.type === ParseTreeTokenType.VARIABLE_READ ||
		tok.type === ParseTreeTokenType.STRING_LITERAL)
			paramListToken = tok.parentNode;

		return paramListToken !== null &&
			paramListToken.parentNode !== null &&
			paramListToken.type === ParseTreeTokenType.LIST &&
			paramListToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
			paramListToken.parentNode.getChildCount() === 2; // should be a name followed by a list.
	}
}