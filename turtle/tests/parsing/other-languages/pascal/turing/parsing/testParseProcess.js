import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseProcess(logger) {
	const cases = [
	{
		'code': 'process',
		'treeInfo': {
			'children': [
				{'val': 'process', 'type': ParseTreeTokenType.PROCESS, 'children': []}
			]
		}
	},{'code': `process worker
            loop
            end loop
        end worker`,
		'treeInfo': {
			'children': [
				{'val': 'process', 'type': ParseTreeTokenType.PROCESS, 'children': [
					{'val': 'worker', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'type': ParseTreeTokenType.CODE_BLOCK},
					{'type': ParseTreeTokenType.END_PROCESS, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'worker', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};