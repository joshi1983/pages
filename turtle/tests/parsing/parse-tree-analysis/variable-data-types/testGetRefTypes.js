import { getRefTypes } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getRefTypes.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
await LogoParser.asyncInit();
await ParseTreeToken.asyncInit();

export function testGetRefTypes(logger) {
	const code = 'make "x plistCreate\nsetProperty "x "key 5';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const testTokens = ParseTreeToken.flatten(tree).filter(t => t.val === 'x' && t.type === ParseTreeTokenType.STRING_LITERAL);
	if (testTokens.length !== 2)
		logger('Expected 2 test tokens but got ' + testTokens.length);
	else {
		const makeToken = testTokens.filter(t => t.parentNode.val === 'make')[0];
		const setPropToken = testTokens.filter(t => t.parentNode.val === 'setProperty')[0];
		if (setPropToken === undefined)
			logger('setPropToken expected to be found but it was not.');
		else {
			const types = getRefTypes(setPropToken).toString();
			const expectedTypes = 'plist';
			if (types !== expectedTypes)
				logger(`Expected "${expectedTypes}" but got "${types}".`);
		}
		if (makeToken === undefined)
			logger('makeToken expected to be found but it was not.');
	}
};