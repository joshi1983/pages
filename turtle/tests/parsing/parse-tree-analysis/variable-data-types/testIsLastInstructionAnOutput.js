import { isLastInstructionAnOutput } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/isLastInstructionAnOutput.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { tokenToProcedure } from '../../../../modules/parsing/parse-tree-analysis/tokenToProcedure.js';

export function testIsLastInstructionAnOutput(logger) {
	const cases = [
		{'code': '', 'result': false},
		{'code': 'fd 10', 'result': false},
		{'code': 'if 2 < 3 [output 5]', 'result': true},
		{'code': 'repeat 4 [output 5]', 'result': true},
		{'code': 'for ["x 0 5 1] [output 5]', 'result': true},
		{'code': 'output 5', 'result': true},
		{'code': 'stop', 'result': false}
	];
	cases.forEach(function(caseInfo) {
		const code = `to p\n${caseInfo.code}\nend`;
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		const procToken = ParseTreeToken.flatten(tree).filter(t => t.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)[0];
		if (procToken === undefined)
			logger('Expected to find procedure but did not');
		else {
			const procedure = tokenToProcedure(procToken);
			const result = isLastInstructionAnOutput(procedure);
			if (result !== caseInfo.result)
				logger(`Expected ${caseInfo.result} but got ${result}`);
		}
	});
};