import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

/*
DOCSTring's are essentially comments.
They translate to comments in WebLogo.

Nevertheless, we want to include them in parse trees since they have clear relationships 
and specific locations with respect to the functions or modules they document.
*/
export function testParseDocstring(logger) {
	const cases = [{
		'code': `def my_function():
    '''Demonstrates triple double quotes
    docstrings and does nothing really.'''`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'children': []},
					{'val': 'my_function', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'type': ParseTreeTokenType.DOCSTRING, 'children': []}
					]},
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};