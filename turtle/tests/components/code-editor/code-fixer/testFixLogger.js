import { FixLogger } from '../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testFixLogger(logger) {
	const parseLogger = new TestParseLogger(logger, '');
	const fixLogger = new FixLogger(parseLogger);
	const parseToken = new ParseTreeToken('x', null, 0, 0, ParseTreeTokenType.LEAF);
	fixLogger.log('Hello World', parseToken);
};