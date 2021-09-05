import { FormatLogger } from '../../../../modules/components/code-editor/format/FormatLogger.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { LogoScanner } from '../../../../modules/parsing/LogoScanner.js';
import { noop } from '../../../../modules/noop.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
await LogoScanner.asyncInit();
await LogoParser.asyncInit();

function findTokenByVal(parseTokens, val) {
	const matches = parseTokens.filter(t => t.val === val);
	if (matches.length === 0)
		throw new Error('Unable to find a token with val: ' + val);
	if (matches.length > 1)
		throw new Error('Ambigious. More than 1 token found with val=' + val + ', Found ' + matches.length + ' matches.');
	return matches[0];
}

function parse(code, logger) {
	const parseLogger = new TestParseLogger(noop, code);
	const tokens = LogoScanner.scan(code);
	const noComments = tokens.filter(t => !t.isComment());
	const treeRoot = LogoParser.getParseTree(noComments, parseLogger);
	if (parseLogger.hasLoggedErrors())
		logger('Unexpected parse errors found while parsing ' + code);
	else
		return treeRoot;
}

function testRemoveSpacePrefixForNextLog(logger) {
	const code = 'print -:x';
	const tokens = LogoScanner.scan(code);
	const formatLogger = new FormatLogger(tokens);
	const treeRoot = parse(code, logger);
	// variable x is undeclared but parsing should pass anyway.
	// Checking for undeclared or unassigned values is done after parsing.
	if (treeRoot !== undefined) {
		const parseTokens = ParseTreeToken.flatten(treeRoot);
		formatLogger.log('print', findTokenByVal(parseTokens, 'print'));
		formatLogger.log('-', findTokenByVal(parseTokens, '-'));
		formatLogger.removeSpacePrefixForNextLog();
		formatLogger.log(':x', findTokenByVal(parseTokens, 'x'));
		const expected = 'print -:x';
		if (formatLogger.getString() !== expected)
			logger('Expected getString() to return "' + expected + '" but got "' + formatLogger.getString() + '"');
	}
}

function testFormatLoggerBasics(logger) {
	const code = '; here is the first comment\nfd 100 ; here is the last comment';
	const tokens = LogoScanner.scan(code);
	const formatLogger = new FormatLogger(tokens);
	if (formatLogger.scanIndex !== 0)
		logger('scanIndex expected to be 0 but got ' + formatLogger.scanIndex);
	if (formatLogger.indentation !== 0)
		logger('indentation expected to be 0 but got ' + formatLogger.indentation);
	const commentsS = formatLogger.getString();
	const expectedComments = '; here is the first comment\n; here is the last comment';
	if (commentsS !== expectedComments)
		logger('Expected to get all comments before logging anything.  Expecting: ' + expectedComments + ' but got ' + commentsS);
	formatLogger.getNextLines();
	formatLogger.newLine();
	formatLogger.blankLine();
	formatLogger.indent();
	if (formatLogger.indentation !== 1)
		logger('indent(), indentation expected to be 1 but got ' + formatLogger.indentation);
	formatLogger.deindent();
	if (formatLogger.indentation !== 0)
		logger('deindent(), indentation expected to be 0 but got ' + formatLogger.indentation);
	formatLogger.clearIndentation();
	if (formatLogger.indentation !== 0)
		logger('after clearIndentation, indentation expected to be 0 but got ' + formatLogger.indentation);
	const s = formatLogger.getString();
	if (typeof s !== 'string')
		logger('string expected from getString() but got ' + typeof s);

	const treeRoot = parse(code, logger);
	if (treeRoot !== undefined) {
		const parseTokens = ParseTreeToken.flatten(treeRoot);
		const token = parseTokens.filter(t => t.val === 'fd')[0];
		formatLogger.log(token.val, token);
		const s2 = formatLogger.getString();
		if (s2.indexOf('first comment') === -1)
			logger('Expected to find "first comment" in: ' + s2);
		if (s2.indexOf(token.val) === -1)
			logger('Expected to find "' + token.val + '" in: ' + s2);
		const expectedResult = '; here is the first comment\nfd\n; here is the last comment';
		if (s2.indexOf('last comment') === -1)
			logger('Expected to find "last comment" in: ' + s2);
		else if (s2 !== expectedResult)
			logger('Expected "' + expectedResult + '" but got "' + s2 + '"');
		
		const hundredToken = parseTokens.filter(t => t.val === 100)[0];
		formatLogger.log('' + hundredToken.val, hundredToken);
		const s3 = formatLogger.getString();
		const expectedResult2 = '; here is the first comment\nfd 100\n; here is the last comment';
		if (s3 !== expectedResult2)
			logger('Expected ' + expectedResult2 + ' but got ' + s3);
	}
	if (isNaN(formatLogger.indentation))
		logger('indentation expected to be a number but got ' + formatLogger.indentation);
}

function testSimulatedComments(logger) {
	const code = 'pendown;comment\npenup';
	const tokens = LogoScanner.scan(code);
	const formatLogger = new FormatLogger(tokens);
	{
		const expected = ';comment';
		if (expected !== formatLogger.getString())
			logger('Expected ' + expected + ' but got ' + formatLogger.getString());
	}
	const treeRoot = parse(code, logger);
	if (treeRoot !== undefined) {
		const parseTokens = ParseTreeToken.flatten(treeRoot);
		const pendownToken = findTokenByVal(parseTokens, 'pendown');
		formatLogger.log('pendown', pendownToken);
		{
			const expected = 'pendown\n;comment';
			if (expected !== formatLogger.getString())
				logger('After log pendown, expected ' + expected + ' but got ' + formatLogger.getString());
		}
		formatLogger.newLine();
		const penupToken = findTokenByVal(parseTokens, 'penup');
		formatLogger.log('penup', penupToken);
		{
			const expected = 'pendown\n;comment\npenup';
			if (expected !== formatLogger.getString())
				logger('After log penup, expected ' + expected + ' but got ' + formatLogger.getString());
		}
	}
}

function testGetStringShouldNotRemoveImportantSpaces(logger) {
	const literalCode = '\'This program draws shapes based on the number you enter in a uniform pattern.\'';
	const code = `print ${literalCode}`;
	const treeRoot = parse(code, logger);
	const scannedTokens = LogoScanner.scan(code);
	const tokens = ParseTreeToken.flatten(treeRoot);
	const literalToken = tokens.filter(token => token.val !== null && token.val.indexOf('This program') !== -1)[0];
	const formatLogger = new FormatLogger(scannedTokens);
	formatLogger.log(literalCode, literalToken);
	const s = formatLogger.getString();
	const expected = literalCode;
	if (s !== expected)
		logger(`Expected ${expected} but got ${s}`);
}

export function testFormatLogger(logger) {
	testGetStringShouldNotRemoveImportantSpaces(prefixWrapper('testGetStringShouldNotRemoveImportantSpaces', logger));
	testRemoveSpacePrefixForNextLog(prefixWrapper('testRemoveSpacePrefixForNextLog', logger));
	testFormatLoggerBasics(prefixWrapper('testFormatLoggerBasics', logger));
	testSimulatedComments(prefixWrapper('testSimulatedComments', logger));
};