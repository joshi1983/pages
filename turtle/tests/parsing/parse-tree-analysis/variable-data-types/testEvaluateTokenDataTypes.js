import { analyzeTokenDataTypes } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeTokenDataTypes.js';
import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { findToken } from '../../../helpers/findToken.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testEvaluateTokenDataTypes(logger) {
	const cases = [
		{'code': 'fd 100', 'tokenTypeChecks': [
			{'val': 100, 'types': 'int'},
			{'val': 'fd', 'types': ''},
		]},
		{'code': 'fd :x/0', 'tokenTypeChecks': [
			{'val': 0, 'types': 'int'},
			{'val': '/', 'types': 'num(unfinite)'},
		]},
		{'code': 'make "x random 10\nfd :x/0', 'tokenTypeChecks': [
			{'val': 0, 'types': 'int'},
			{'val': '/', 'types': 'num(unfinite)'},
		]},
		{'code': 'make "x 100\nfd :x', 'tokenTypeChecks': [
			{'val': "x", 'type': ParseTreeTokenType.VARIABLE_READ, 'types': 'int'},
		]},
		{'code': 'fd 10 + 50', 'tokenTypeChecks': [
			{'val': '+', 'types': 'int'}
		]},
		{'code': 'fd 10.23 + 50', 'tokenTypeChecks': [
			{'val': '+', 'types': 'num(finite)'}
		]},
		{'code': 'print sum 10 50', 'tokenTypeChecks': [
			{'val': 'sum', 'types': 'int'}
		]},
		{'code': 'print abs -50', 'tokenTypeChecks': [
			{'val': 'abs', 'types': 'int'}
		]},
		{'code': 'print abs -50.5', 'tokenTypeChecks': [
			{'val': 'abs', 'types': 'num(finite)'}
		]},
		{'code': 'make "x 5 print -:x', 'tokenTypeChecks': [
			{'val': 5, 'types': 'int'},
			{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ, 'types': 'int'},
			{'val': '-', 'types': 'int'}
		]},
		{'code': 'to p\noutput 5\nend print p', 'tokenTypeChecks': [
			{'val': 'p', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'types': 'int'}
		]},
		{'code': 'to p\nlocalmake "x 5\noutput :x\nend print p', 'tokenTypeChecks': [
			{'val': 'p', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'types': 'int'}
		]},
		{'code': 'to p :x\nfd :x\nend\np 3 + 4\np 8 + 12', 'tokenTypeChecks': [
			{'val': '+', 'hasChildVal': 3, 'types': 'int'},
			{'val': '+', 'hasChildVal': 8, 'types': 'int'}
		]},
		{'code': 'to p :x\nfd :x\nend', 'tokenTypeChecks': [
			{'val': 'x', 'hasParentVal': 'fd', 'type': ParseTreeTokenType.VARIABLE_READ, 'types': 'num(finite)'}
		]},
		{'code': 'to p :x\nprint -:x\nend\np 3\np9', 'tokenTypeChecks': [
			{'val': '-', 'types': 'int'}
		]},
		{'code': 'to p :x\nprint abs :x\nend\np 3\np9', 'tokenTypeChecks': [
			{'val': 'abs', 'types': 'int'}
		]},
		{'code': 'make "x 5\nprint :x', 'tokenTypeChecks': [
			{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ, 'types': 'int'}
		]},
		{'code': 'make "x 1 print sum (-:x) 1', 'tokenTypeChecks': [
			{'type': ParseTreeTokenType.VARIABLE_READ, 'types': 'int'},
			{'val': '-', 'types': 'int'},
			{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'types': 'int'},
			{'val': 'sum', 'types': 'int'},
		]},
		{'code': 'print :x + 1', 'tokenTypeChecks': [
			{'val': '+', 'types': 'num'}
		]},
		{'code': 'make "x 5\nprint :x + 1', 'tokenTypeChecks': [
			{'val': '+', 'types': 'int'}
		]},
		{
			'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]',
			'tokenTypeChecks': [
				{'val': 'i',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'hasParentVal': '+',
					'types': 'num'
				},
				{'val': '+', 'types': 'num'}
			]
		},
		{
			'code': 'make "x 300\nto p\nend\nfd :x',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'int'
				}
			]
		},
		{
			'code': 'to p\nmake "x 5\nend\np\nprint :x',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'int'
				}
			]
		},
		{
			'code': 'to p\nlocalmake "prevPos false\nrepeat 2 [\nifelse :prevPos = false [\nsetHeading 220\n] [\nsetHeading (towards :prevPos)\n]\nlocalmake "prevPos pos\n]\nend',
			'tokenTypeChecks': [
				{
					'val': 'prevPos',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'hasParentVal': 'towards',
					'types': 'bool|list<num>(minlen=3)'
				}
			]
		},
		{
			'code': 'make "x 5\nmake "x 10\nprint :x',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'int'
				}
			]
		},
		{
			'code': 'make "x "#ddd\nmake "x "#ff0\nprint :x',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'colorstring'
				}
			]
		},
		{
			'code': 'make "x "#ddd\nmake "x "#ff0\nto p\nprint :x\nend',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'colorstring'
				}
			]
		},
		{
			'code': 'make "x "hello\nmake "x "#ff0\nto p\nprint :x\nend',
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'colorstring'
				}
			]
		},
		{
			'code': '"make "x "hello\nto p\nprint :x\np ; procedure call\nend make "x 5\np',
			// procedure call between hello and 5 but the procedure call is in a procedure.
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'int'
				}
			]
		},
		{
			'code': 'to p\nprint :x\nend\nmake "x "hello\np\nmake "x 5\np',
			// p is called with type string and then separately called with type int
			'tokenTypeChecks': [
				{
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ,
					'types': 'int|string'
				}
			]
		},
		{
			'code': `to p
end

print mix "white "red
p`, // not valid code but it still should not throw a JavaScript error.
			'tokenTypeChecks': [
				{
					'val': 'mix',
					'types': 'colorlist'
				}
			]
		},
		{
		'code': `make "offsets [60 90 120]
make "points []
queue2 "points pos
repeat 2 [
	print 3 + (item repcount :offsets)
		]`, 'tokenTypeChecks': [{
			'val': 'item',
			'types': 'num'
	}, {
		'val': 'offsets',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'types': 'colorlist'
	}]
	},
	{'code': `to p :value
	if string? :value [
		print :value
		output "s
	]
	if integer? :value [
		print :Value
		output "num
	]
	output str :value
end

print p "red`, 'tokenTypeChecks': [
	{
		'val': 'value',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': 'str',
		'types': undefined
		// 'num' would be ideal but undefined is good enough for now.
	},
	{
		'val': 'Value',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': 'print',
		'types': 'int'
	},
	{
		'val': 'value',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': 'print',
		'types': 'string'
	}
]
	},{'code': `to p :x
	if integer? :x [
		localmake "x abs :x
		localmake "result ''
		output :result
	]
	if boolean? :x [
		output ifelse :x '1' '0'
	]
	output :x
end`, 'tokenTypeChecks': [
	{
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': 'abs',
		'types': 'int'
	},
	{
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': 'ifelse',
		'types': 'bool'
	}
]},
{'code': `to p :num :x
	if list? :num [
		if list? :x [
			output []
		]
	]
	localmake "result "
	localmake "i 0
	while :i < :x [
		localmake "i :i + 1
	]
	output :result
end`, 'tokenTypeChecks': [
	{
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': '<',
		'types': 'alphacolor|list|num|string'
		// 'list|num' would be ok too.
	}
]}
];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const variables = getAnalyzedVariables(cachedParseTree);
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const tokenTypes = analyzeTokenDataTypes(cachedParseTree, tokenValueMap, variables);
		const plogger = prefixWrapper(`Case ${index} with code ${caseInfo.code}`, logger);
		caseInfo.tokenTypeChecks.forEach(function(tokenTypeInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const match = findToken(tokenTypeInfo, cachedParseTree, plogger);
			if (match !== undefined) {
				let result = tokenTypes.get(match);
				if (typeof result === 'string')
					clogger('Expected an instance of DataTypes but got a string: ' + result);
				if (result instanceof DataTypes)
					result = result.toString();
				if (result !== tokenTypeInfo.types) {
					if (tokenTypeInfo.type !== undefined)
						tokenTypeInfo.type = ParseTreeTokenType.getNameFor(tokenTypeInfo.type);
					clogger(escapeHTML(`Expected ${tokenTypeInfo.types} but got ${result} for check ${JSON.stringify(tokenTypeInfo)}`));
				}
			}
		});
	});
};