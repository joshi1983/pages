import { Command } from '../../../parsing/Command.js';
import { convertParseTreeTokensToScanTokens } from '../../../parsing/convertParseTreeTokensToScanTokens.js';
import { FormatLogger } from './FormatLogger.js';
import { isInstructionList } from '../../../parsing/parse-tree-analysis/isInstructionList.js';
import { isInstructionListChild } from '../../../parsing/parse-tree-analysis/getInstructionListChildToken.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { LogoScanner } from '../../../parsing/LogoScanner.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../parsing/Procedure.js';
import { tokenToProcedure } from '../../../parsing/parse-tree-analysis/tokenToProcedure.js';
await Command.asyncInit();
await LogoParser.asyncInit();
await LogoScanner.asyncInit();

function formatUsingToString(token, logger) {
	logger.log('' + token.toString(), token);
}

function formatBinaryOperator(binToken, logger) {
	const children = binToken.children;
	if (children.length !== 0)
		formatToken(children[0], logger);
	logger.log('' + binToken.val, binToken);
	if (children.length >= 2)
		formatToken(children[1], logger);
}

function formatUnaryOperator(uToken, logger) {
	logger.log(uToken.val, uToken);

	// There should always be 1 child for a unary operation but we're just being safe.
	if (uToken.children.length === 1) {
		logger.removeSpacePrefixForNextLog();
		formatToken(uToken.children[0], logger);
	}
}

function formatCurvedBracketExpression(cbToken, logger) {
	logger.log('(', cbToken);
	logger.indent();
	cbToken.children.filter(t => t.val !== '(' && t.val !== ')').forEach(function(child) {
		formatToken(child, logger);
	});
	logger.deindent();
	logger.log(')', cbToken);
}

function formatList(lToken, logger) {
	if (lToken.children.length < 2)
		return;
	logger.log('[', lToken.children[0]);
	const isInstructionList_ = isInstructionList(lToken);
	if (isInstructionList_)
		logger.newLine();
	logger.indent();
	lToken.children.filter(t => t.val !== '[' && t.val !== ']').forEach(function(child) {
		if (isInstructionList_)
			logger.newLine();
		formatToken(child, logger);
	});
	if (isInstructionList_)
		logger.newLine();
	logger.deindent();
	logger.log(']', lToken.children[lToken.children.length - 1]);
}

function formatProcedure(pToken, logger) {
	logger.clearIndentation();
	logger.blankLine();
	if (pToken.children.length < 2) {
		logger.log('to ', pToken);
		if (pToken.children.length === 1 && typeof pToken.children[0].val === 'string') {
			logger.log(pToken.children[0].val);
		}
		logger.newLine();
		logger.log('end', pToken);
		logger.blankLine();
		return;
	}
	const proc = tokenToProcedure(pToken);
	logger.log('to ' + proc.nameToken.val, pToken);
	proc.parameters.forEach(function(parameterName, index) {
		const paramToken = proc.getTokenForParameter(index);
		logger.log(':' + paramToken.val, paramToken);
	});
	logger.newLine();
	const instructionsToken = proc.getInstructionListToken();
	logger.indent();
	instructionsToken.children.forEach(function(child) {
		formatToken(child, logger);
	});
	logger.clearIndentation();
	logger.newLine();
	logger.log('end', proc.getEndToken());
	logger.blankLine();
}

function formatPrefixed(token, logger) {
	let isSeparateLine = false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if ((info !== undefined && Command.getReturnTypes(info) === null) || isInstructionListChild(token))
			isSeparateLine = true;
	}
	if (isSeparateLine)
		logger.newLine();
	logger.log(token.val, token);
	token.children.forEach(function(child) {
		formatToken(child, logger);
	});

	if (isSeparateLine)
		logger.newLine();
}

function formatToken(token, logger) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		formatBinaryOperator(token, logger);
	else if (token.type === ParseTreeTokenType.LIST)
		formatList(token, logger);
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		formatCurvedBracketExpression(token, logger);
	else if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		formatProcedure(token, logger);
	else if ([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.VARIABLE_READ].indexOf(token.type) !== -1)
		formatUsingToString(token, logger);
	else if ([ParseTreeTokenType.LEAF, ParseTreeTokenType.PROCEDURE_END_KEYWORD].indexOf(token.type) !== -1)
		logger.log(token.val.toLowerCase(), token);
	else if (ParseTreeTokenType.NEW_LINE === token.type) {
		// ignore new lines.
		// new lines are part of the formatting we're controlling so we don't want to add them just because they were in the input.
	}
	else if (ParseTreeTokenType.UNARY_OPERATOR === token.type)
		formatUnaryOperator(token, logger);
	else if (ParseTreeTokenType.PARAMETERIZED_GROUP === token.type)
		formatPrefixed(token, logger);
	else {
		console.error('Unrecognized type: ' + ParseTreeTokenType.getNameFor(token.type));
	}
}

function formatTreeRoot(treeRoot, scannedTokens) {
	const logger = new FormatLogger(scannedTokens);
	treeRoot.children.forEach(function(token) {
		formatToken(token, logger);
	});
	return logger.getString();
}

export function formatCode(code, treeRoot, treeHasNoErrors) {
	if (typeof code !== 'string')
		throw new Error('code must be a string');
	if (typeof treeHasNoErrors !== 'boolean' && treeRoot !== undefined)
		throw new Error('Any time the treeRoot is specified, the treeHasNoErrors must also be true or false.  treeHasNoErrors was specified as ' + treeHasNoErrors);

	if (treeRoot !== undefined && treeHasNoErrors === false)
		return code.trim(); // no need to process anymore.

	let scannedTokens;
	if (treeRoot === undefined)
		scannedTokens = LogoScanner.scan(code);
	else
		scannedTokens = convertParseTreeTokensToScanTokens(treeRoot);
	let parseLogger;
	if (treeRoot === undefined) {
		parseLogger = new ParseLogger();
		const noCommentTokens = scannedTokens.filter(t => !t.isComment());
		treeRoot = LogoParser.getParseTree(noCommentTokens, parseLogger);
	}
	if (parseLogger !== undefined && parseLogger.hasLoggedErrors())
		return code.trim();
	else {
		return formatTreeRoot(treeRoot, scannedTokens);
	}
}