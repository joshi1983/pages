import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../LogoParser.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const procNames = new Set([
	'kojorestoreposhe',
	'kojosaveposhe'
]);

function isOfInterest(token) {
	return procNames.has(token.val.toLowerCase());
}

export function needsSavePosHeVariable(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (tree === undefined)
		return false;
	return getDescendentsOfType(tree, ParseTreeTokenType.LEAF).some(isOfInterest);
};