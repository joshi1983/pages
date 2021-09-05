import { getCSSClassNameForParseToken } from '../../../modules/components/syntax-highlighter/getCSSClassNameForParseToken.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testGetCSSClassNameForParseToken(logger) {
	// some code that would parse to almost all the token types.
	const code = 'to p :x\nfd :x\n print -:x\nprint "Hello\nrepeat 5 [print 100]\nend\n\np (sum 20 50 23*234)';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const tokens = ParseTreeToken.flatten(tree);
	tokens.forEach(function(token) {
		const result = getCSSClassNameForParseToken(token);
		if (result !== undefined && typeof result !== 'string')
			logger('Expected either undefined or a string but got: ' + result);
	});
};