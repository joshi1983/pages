import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { parseTreeTokenToElement } from '../../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testParseTreeTokenToElement(logger) {
	const code = 'repeat 6 [ fd 100 right 60]';
	const testLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, testLogger);
	const e = parseTreeTokenToElement(tree, ParseTreeTokenType);
	if (!(e instanceof Element))
		logger('parseTreeTokenToElement expected to return an Element but got ' + e);
	else {
		const substrings = ['repeat', '6', '[', 'fd', '100', 'right', '60', ']'];
		const textContent = e.textContent;
		substrings.forEach(function(substring) {
			if (textContent.indexOf(substring) === -1)
				logger('Expected to find ' + substring + ' but could not find it in ' + textContent);
		});
	}
};