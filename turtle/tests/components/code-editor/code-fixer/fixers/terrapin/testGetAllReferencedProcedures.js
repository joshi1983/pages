import { getAllReferencedProcedureNames } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/getAllReferencedProcedures.js';
import { LogoParser } from
'../../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetAllReferencedProcedures(logger) {
	const cases = [
		{'code': 'fd 100', 'names': []},
		{'code': 'print', 'names': []},
		{'code': 'time', 'names': ['time']},
		{'code': 'print cot 1', 'names': ['cot']},
		{'code': 'print csc 1', 'names': ['csc']},
		{'code': 'setFontFamilyAndSize "Arial 3', 'names': ['setfontfamilyandsize']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		if (tree === undefined) {
			plogger(`Expected to successfully parse code but it failed.`);
			return;
		}
		const result = getAllReferencedProcedureNames(tree);
		if (result.length !== caseInfo.names.length)
			plogger(`Expected ${caseInfo.names.length} procedure names but found ${result.length}`);
		else {
			for (let i = 0; i < result.length; i++) {
				const expected = caseInfo.names[i];
				if (result[i] !== expected)
					plogger(`Expected result[${i}] to be ${expected} but found ${result[i]}`);
			}
		}
	});
};