import { LogoParser } from
'../../../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../../../modules/parsing/loggers/ParseLogger.js';

await LogoParser.asyncInit();

export function codeToToken(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree.children.length !== 1)
		throw new Error(`root should have exactly 1 child but found ${tree.children.length}`);
	return tree.children[0];
};