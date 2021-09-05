import { getOutputTypesForProcedure } from '../../../modules/parsing/parse-tree-analysis/getOutputTypesForProcedure.js';
import { getProceduresMap } from '../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testGetOutputTypesForProcedure(logger) {
	const cases = [
		{'code': '', 'result': null},
		{'code': 'stop', 'result': null},
		{'code': 'output 5', 'result': 'int'},
		{'code': 'output "Hello', 'result': 'string'},
		{'code': 'output []', 'result': 'list'},
		{'code': 'if :x < 3 [\noutput 4\n]\noutput "Hello', 'result': 'int|string'}
	];
	cases.forEach(function(caseInfo) {
		const code = `to p\n${caseInfo.code}\nend`;
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (parseLogger.hasLoggedErrors())
			plogger('Unexectedly ran into a parsing error for code: ' + code);
		else {
			const procToken = ParseTreeToken.flatten(tree).filter(t => t.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)[0];
			const proceduresMap = getProceduresMap(tree);
			const variableNamesNotToCheck = new Set();
			const result = getOutputTypesForProcedure(procToken, proceduresMap, variableNamesNotToCheck);
			if (caseInfo.result === null) {
				if (result !== null)
					logger('Expected null but got a result of ' + result);
			}
			else {
				const resultString = '' + result;
				if (resultString !== caseInfo.result)
					logger(`Expected ${caseInfo.result} but got ${resultString}`);
			}
		}
	});
};