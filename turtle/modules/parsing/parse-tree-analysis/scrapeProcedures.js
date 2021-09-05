import { LogoParser } from '../LogoParser.js';
import { scrapeProceduresFromParseTreeTokens } from './scrapeProceduresFromParseTreeTokens.js';

export function scrapeProcedures(codeString, parseLogger) {
	const tree = LogoParser.getParseTree(codeString, parseLogger);
	if (parseLogger.hasLoggedErrors())
		return;

	return scrapeProceduresFromParseTreeTokens(tree);
};