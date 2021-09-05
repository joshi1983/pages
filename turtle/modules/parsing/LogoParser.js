import { Command } from './Command.js';
import { asyncInit as createParameterizedGroupsInit, createParameterizedGroups } from './createParameterizedGroups.js';
import { fixOperatorPrecedence } from './fixOperatorPrecedence.js';
import { getProceduresMap } from './parse-tree-analysis/getProceduresMap.js';
import { LogoParsingStates } from './LogoParsingStates.js';
import { LogoScanner } from './LogoScanner.js';
import { Operators } from './Operators.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { validateIdentifier } from './parse-tree-analysis/validateIdentifier.js';

async function asyncInit() {
	await Command.asyncInit();
	await LogoScanner.asyncInit();
	await LogoParsingStates.asyncInit();
	await Operators.asyncInit();
	await ParseTreeToken.asyncInit();
	await createParameterizedGroupsInit();
}
const initPromise = asyncInit();

/*
Some helpful examples are at:
http://cs.brown.edu/courses/bridge/1997/Resources/LogoTutorial.html
*/
export class LogoParser {
	static asyncInit() {
		return initPromise;
	}

	static getParseTree(text, parseLogger, proceduresMap) {
		if (typeof parseLogger !== 'object' || typeof parseLogger.error !== 'function')
			throw new Error('parseLogger must be an object with an error method');
		if (proceduresMap !== undefined && !(proceduresMap instanceof Map))
			throw new Error('proceduresMap must either be undefined or a Map');

		const tokens = text instanceof Array ? text : LogoScanner.getTokensForParsing(text);
		let result = [];
		let currentToken = null;
		let isEndingParameterList;

		function endParameterList(token) {
			const commandList = ParseTreeToken.createFromType(ParseTreeTokenType.LIST, token);
			var procStartToken = currentToken.parentNode;
			if (procStartToken.type === ParseTreeTokenType.LIST)
				procStartToken = procStartToken.parentNode;
			procStartToken.appendChild(commandList);
			currentToken = commandList;
			isEndingParameterList = true;
		}
		for (var i = 0; i < tokens.length; i++) {
			let token = ParseTreeToken.createFromScannedToken(tokens[i], LogoParsingStates.getImpossibleTypes(currentToken));
			isEndingParameterList = false;
			if (currentToken === null) {
				if (token.val === '[' || token.val === '(') {
					const type = token.val === '[' ? ParseTreeTokenType.LIST : ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
					const parentNode = ParseTreeToken.createFromType(type, token);
					parentNode.appendChild(token);
					currentToken = token;
					result.push(parentNode);
				}
				else {
					currentToken = token;
				}
			}
			else {
				if (token.type !== ParseTreeTokenType.NEW_LINE &&
				LogoParsingStates.isInProcedureParameterList(currentToken)
				) {
					if (token.type !== ParseTreeTokenType.VARIABLE_READ) {
						if ((token.type === ParseTreeTokenType.LEAF && Command.getCommandInfo(token.val) !== undefined) ||
						(token.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD)) {
							endParameterList(token);
							i--;
						}
						else {
							if (token.isBracket())
								parseLogger.error(`Procedure parameters or a new line expected but bracket ${token.val} found.`, token);
							else
								parseLogger.error('All procedure arguments must start with \':\' and you should break the line to mark the end of your parameters.', token);
							return;
						}
					}
					else {
						if (currentToken.type === ParseTreeTokenType.LIST) {
							currentToken.appendChild(token);
						}
						else {
							currentToken.appendSibling(token);
						}
						currentToken = token;
					}
				}
				else if (LogoParsingStates.isExpectingProcedureName(currentToken)) {
					if (token.type !== ParseTreeTokenType.LEAF) {
						if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
							parseLogger.error('Invalid procedure name.  This name indicates the start of a procedure.', token);
						else if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL)
							parseLogger.error('Invalid procedure name.  Boolean values are invalid procedure names.', token);
						else if (token.type === ParseTreeTokenType.STRING_LITERAL)
							parseLogger.error('Invalid procedure name.  Remove the quotation mark(").', token);
						else if (token.type === ParseTreeTokenType.NUMBER_LITERAL)
							parseLogger.error('Invalid procedure name.  Procedure names must not be numbers or start with a digit.', token);
						else {
							parseLogger.error('Valid procedure name expected.', token);
						}
					}
					else if (typeof token.val === 'string' && validateIdentifier(token.val) !== undefined) {
						parseLogger.error('Invalid procedure name.  "' + token.val + '" ' + validateIdentifier(token.val), token);
					}
					else {
						currentToken.appendChild(token);
						const parameterList = ParseTreeToken.createFromType(ParseTreeTokenType.LIST, token);
						currentToken.appendChild(parameterList);
						currentToken = parameterList;
					}
				}
				else if (token.type === ParseTreeTokenType.NEW_LINE) {
					if (LogoParsingStates.isInProcedureParameterList(currentToken)) {
						endParameterList(token);
					}
				}
				else if (token.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD) {
					if (LogoParsingStates.isExpectingProcedureEndOrCommand(currentToken)) {
						if (currentToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
							currentToken.appendSibling(token);
							currentToken = currentToken.parentNode;
						}
						else {
							currentToken.parentNode.appendSibling(token);
							currentToken = token.parentNode;
						}
					}
					else {
						parseLogger.error('Unexpected end to procedure.  Did you forget to start the procedure or give it a name?  Are all your square brackets balanced in the procedure?', token);
					}
				}
				else if (LogoParsingStates.isExpectingProcedureEndOrCommand(currentToken) &&
				!token.isBracketOrBinaryOperator()) {
					if (currentToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
						currentToken.appendChild(token);
					}
					else {
						currentToken.appendSibling(token);
					}
					currentToken = token;
				}
				// if '[', add as a child.
				else if (token.val === '[') { // start of list
					const parentToken = ParseTreeToken.createFromType(ParseTreeTokenType.LIST, token);
					parentToken.appendChild(token);
					if (currentToken.type === ParseTreeTokenType.LIST && currentToken.children.length === 0)
						currentToken.appendChild(parentToken);
					else
						currentToken.appendSibling(parentToken);
					currentToken = token;
					token = parentToken;
				}
				else if (token.val === ']') { // end of list
					currentToken.appendSibling(token);
					if (currentToken.parentNode === null) {
						parseLogger.error('Unexpected end of list', token);
					}
					else if (currentToken.parentNode.type !== ParseTreeTokenType.LIST)
						parseLogger.error('Unexpected ] encountered since we are not in a list', token);
					currentToken = currentToken.parentNode;
				}
				else if (token.val === '(') {
					const parentToken = ParseTreeToken.createFromType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, token);
					parentToken.appendChild(token);
					if (currentToken.type === ParseTreeTokenType.LIST && currentToken.children.length === 0)
						currentToken.appendChild(parentToken);
					else
						currentToken.appendSibling(parentToken);
					currentToken = token;
					token = parentToken;
				}
				else if (token.val === ')') { // end of curved bracket expression
					currentToken.appendSibling(token);
					if (currentToken.parentNode === null) {
						parseLogger.error('Unexpected end of curved bracket expression', token);
						return;
					}
					else if (currentToken.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
						parseLogger.error('Unexpected ) encountered since we are not in a curved bracket expression', token);
						return;
					}
					currentToken = currentToken.parentNode;
				}
				else if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
					currentToken.appendSibling(token);
					currentToken = token;
				}
				else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
					const parentNode = currentToken.parentNode;
					const nextTokenString = typeof tokens[i + 1] === 'object' ? tokens[i + 1].s : '';
					const nextToken = nextTokenString ? ParseTreeToken.createFromScannedToken(tokens[i + 1], LogoParsingStates.getImpossibleTypes(token)) : null;
					if (LogoParsingStates.canBeUnaryOperator(currentToken, token, nextToken, nextTokenString)) {
						token.type = ParseTreeTokenType.UNARY_OPERATOR;
						if (nextToken && nextToken.val === '(') {
							const parentToken = ParseTreeToken.createFromType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, token);
							parentToken.appendChild(nextToken);
							token.appendChild(parentToken);
						}
						else if (nextToken === null) {
							let msg = `The ${token.val} operator needs `
							if (Operators.canBeUnary(token.val))
								msg += '1 or 2 inputs';
							else
								msg += '2 inputs';
							parseLogger.error(msg, token);
						}
						else
							token.appendChild(nextToken);
						if (parentNode !== null)
							parentNode.appendChild(token);
						currentToken = nextToken;
						i++;
					}
					else {
						if (parentNode === null) {
							result.pop();
						}
						else {
							parentNode.removeChild(currentToken);
							parentNode.appendChild(token);
						}
						token.appendChild(currentToken);
					}
				}
				else if (token.type !== ParseTreeTokenType.NEW_LINE) {
					currentToken.appendSibling(token);
					currentToken = token;
				}
				while (LogoParsingStates.isEndingBinaryOperatorExpression(currentToken)) {
					currentToken = currentToken.parentNode;
				}
			}
			if (token.parentNode === null && token.type !== ParseTreeTokenType.NEW_LINE && !isEndingParameterList)
				result.push(token);
		}
		result = ParseTreeToken.createRootTokenFor(result);
		const newMap = getProceduresMap(result);
		if (proceduresMap !== undefined) {
			// merge.
			for (const [key, value] of proceduresMap) {
				if (newMap.has(key))
					parseLogger.error('Duplicate procedure with name ' + key, newMap.get(key).nameToken);
				else
					newMap.set(key, value);
			}
		}
		proceduresMap = newMap;
		createParameterizedGroups(result, proceduresMap, parseLogger);
		fixOperatorPrecedence(result);
		return result;
	}
};