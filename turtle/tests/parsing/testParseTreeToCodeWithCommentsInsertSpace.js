import { assertEquals } from '../helpers/assertEquals.js';
import { findToken } from '../helpers/findToken.js';
import { flatten } from '../../modules/parsing/generic-parsing-utilities/flatten.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../modules/parsing/parseTreeToCodeWithComments.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testParseTreeToCodeWithCommentsInsertSpace(logger) {
	const cases = [
	{
		'code': 'print:x',
		'out': 'print :x',
		'mutation': function(allTokens, logger_) {
			const xToken = findToken({'val': 'x'}, allTokens, logger_);
			if (xToken !== undefined)
				xToken.colIndex++;
		}
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const allTokens = flatten(tree);
		caseInfo.mutation(allTokens, plogger);
		const result = parseTreeToCodeWithComments(tree, caseInfo.code);
		assertEquals(caseInfo.out, result, plogger);
	});
};