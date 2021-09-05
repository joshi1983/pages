import { getAllReferencedProcedures } from
'../../../../../modules/parsing/processing/js-processing/translation-to-weblogo/getAllReferencedProcedures.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../modules/parsing/loggers/ParseLogger.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
await LogoParser.asyncInit();

function wrappedGetAllReferencedProcedures(logger) {
	return function(code) {
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (tree !== undefined)
			return getAllReferencedProcedures(tree);
	};
}

export function testGetAllReferencedProcedures(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print "hi', 'out': ''},
		{'in': 'pCircle 1 2 3', 'outContains': 'to pCircle'},
		{'in': 'pEllipse 1 2 3', 'outContains': 'to pEllipse'}
	];
	testInOutPairs(cases, wrappedGetAllReferencedProcedures(logger), logger);
};