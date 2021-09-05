import { fixFunctionCallsForMicroAInternalFunctions } from
'../../../../../modules/parsing/basic/micro-a/translation-to-weblogo/fixFunctionCallsForMicroAInternalFunctions.js';
import { processParseTestCases as generalProcessParseTestCases } from
'../../../../helpers/parsing/processParseTestCases.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';

function modifiedParse(code) {
	const parseResult = parse(code);
	fixFunctionCallsForMicroAInternalFunctions(parseResult.root);
	return parseResult;
}

export function testFixFunctionCallsForMicroAInternalFunctions(logger) {
	const cases = [
		{	'code': '', 'numTopChildren': 0},
		{
			'code': 'rect 1,2,3,4',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'rect', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '1', 'children': []},
							{'val': ',', 'children': []},
							{'val': '2', 'children': []},
							{'val': ',', 'children': []},
							{'val': '3', 'children': []},
							{'val': ',', 'children': []},
							{'val': '4', 'children': []}
						]}
					]}
				]
			}
		}
	];
	generalProcessParseTestCases(cases, modifiedParse, ParseTreeTokenType, logger);
};