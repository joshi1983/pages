import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../../LogoParser.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { Procedures } from '../Procedures.js';
import { StringBuffer } from '../../../../StringBuffer.js';

export function getReferencedProceduresCode(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	const procCallTokens = getDescendentsOfType(tree, ParseTreeTokenType.LEAF).
		filter(t => Procedures.getImplementation(t.val) !== undefined);
	const procNameSet = new Set(procCallTokens.map(t => t.val.toLowerCase()));
	const procNamesArray = Array.from(procNameSet);
	procNamesArray.sort();
	const result = new StringBuffer();
	for (const name of procNamesArray) {
		result.append(Procedures.getImplementation(name) + '\n');
	}
	
	return result.toString();
};