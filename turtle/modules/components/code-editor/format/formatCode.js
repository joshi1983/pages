import { FormatLogger } from './FormatLogger.js';
import { formatToken } from './token-processors/formatToken.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { LogoScanner } from '../../../parsing/LogoScanner.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
await LogoParser.asyncInit();
await LogoScanner.asyncInit();

function formatTreeRoot(treeRoot, scannedTokens) {
	const logger = new FormatLogger(scannedTokens);
	treeRoot.children.forEach(function(token) {
		formatToken(token, logger);
	});
	return logger.getString();
}

export function formatCode(code) {
	if (typeof code !== 'string')
		throw new Error('code must be a string');

	const scannedTokens = LogoScanner.scan(code);
	const parseLogger = new ParseLogger();
	const noCommentTokens = scannedTokens.filter(t => !t.isComment());
	const treeRoot = LogoParser.getParseTree(noCommentTokens, parseLogger);
	if (parseLogger.hasLoggedErrors())
		return code.trim();
	else {
		return formatTreeRoot(treeRoot, scannedTokens);
	}
}