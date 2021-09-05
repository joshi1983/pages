import { LogoParser } from '../../LogoParser.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../parseTreeToCodeWithComments.js';
import { replaceCommandsToFitDataTypesFixer } from './replaceCommandsToFitDataTypesFixer.js';

export function replaceCommandsToFitDataTypes(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (tree === undefined)
		return webLogoCode; // unable to fix anything if we can't even parse.
	replaceCommandsToFitDataTypesFixer(tree);
	return parseTreeToCodeWithComments(tree, webLogoCode);
};