import { getAllReferencedProcedures } from
'./getAllReferencedProcedures.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';

export function addAllReferencedProcedures(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return code; 
		// unable to parse so unable to determine what procedures are needed.
		// add no procedures.

	return getAllReferencedProcedures(tree) + code;
};