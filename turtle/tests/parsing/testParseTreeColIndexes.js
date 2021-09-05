import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testParseTreeColIndexes(logger) {
	const code = 'fd 100; Hello World';
	const cases = [
		{'val': 'fd', 'colIndex': 1},
		{'val': 100, 'colIndex': 5}
	];
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const tokens = ParseTreeToken.flatten(tree);
	cases.forEach(function(caseInfo, index) {
		const token = tokens.filter(t => t.val === caseInfo.val)[0];
		const plogger = prefixWrapper(`Case ${index} with val=${caseInfo.val}`, logger);
		if (token === undefined)
			plogger('Expected to find a token but did not');
		else {
			if (token.colIndex !== caseInfo.colIndex)
				plogger('Expected colIndex ' + caseInfo.colIndex + ' but got ' + token.colIndex);
		}
	});
};