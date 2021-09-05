import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { scrapeProceduresFromParseTreeTokens } from '../../modules/parsing/parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testScrapeProcedures(logger) {
	const cases = [
		{
			'code': 'to something\nprint "hi\nend', 
			'numProcedures': 1,
			'procedures': [
				{
					'name': 'something',
					'parameters': []
				}
			]
		},
		{
			'code': 'to something\nprint "hi\nend\nprint "hello',
			'numProcedures': 1,
			'procedures': [
				{
					'name': 'something',
					'parameters': []
				}
			]
		},
		{
			'code': 'to fd\nend',
			'numProcedures': 1,
			'procedures': [
				{
					'name': 'fd',
					'parameters': []
				}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		const testParseLogger = new TestParseLogger(logger, caseInfo.code);
		const rootToken = LogoParser.getParseTree(caseInfo.code, testParseLogger);
		const preLogger = prefixWrapper('Failure with code: ' + caseInfo.code, logger);
		const procedures = scrapeProceduresFromParseTreeTokens(rootToken);
		if (procedures.length !== caseInfo.numProcedures)
			preLogger('Number of procedures expected to be ' + caseInfo.numProcedures + ' but got ' + procedures.length);
		else {
			procedures.forEach(function(proc) {
				const matchedProc = caseInfo.procedures.filter(function(resultProc) {
					return resultProc.name.toLowerCase() === proc.name.toLowerCase();
				})[0];
				if (matchedProc === undefined)
					preLogger('Unexpected procedure name ' + proc.name + '.  Expected names are ' 
						+ JSON.stringify(caseInfo.procedures.map((p) => p.name))
					);
				else {
					matchedProc.parameters.forEach(function(parameterName) {
						const index = proc.parameters.indexOf(parameterName);
						if (index === -1)
							preLogger('Unable to find procedure parameter ' + parameterName + ' in parameters ' + JSON.stringify(proc.parameters));
					});
				}
				if (proc.getStartToken() === undefined)
					preLogger('Unable to find start token for procedure ' + proc.name);
			});
		}
	});
};