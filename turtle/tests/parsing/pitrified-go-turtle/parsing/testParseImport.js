import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseImport(logger) {
	const cases = [
	{'code': 'import "fmt"', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'import',
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': '"fmt"', 'type': ParseTreeTokenType.STRING_LITERAL},
				]
				}
			]
	}},
	{'code': 'import f "fmt"', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		// alias package "fmt" as f.
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'import',
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '"fmt"', 'type': ParseTreeTokenType.STRING_LITERAL},
				]
				}
			]
	}},
	{'code': 'import ("fmt")', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': 'import',
					'type': ParseTreeTokenType.IMPORT,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.IMPORT_PACKGE_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': '"fmt"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
							{'val': ')', 'children': []}
						]}
					]
				}
			]
		}
	},{
		'code': `import (
	"flag"
	"fmt"
)`,
		'treeInfo': {
			'children': [
				{
					'val': 'import',
					'type': ParseTreeTokenType.IMPORT,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.IMPORT_PACKGE_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': '"flag"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
							{'val': '"fmt"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
							{'val': ')', 'children': []}
						]}
					]
				}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};