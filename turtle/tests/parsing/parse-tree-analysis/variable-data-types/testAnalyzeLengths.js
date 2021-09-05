import { analyzeLengths } from
'../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeLengths.js';
import { findToken } from
'../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../helpers/getCachedParseTreeFromCode.js';
import { isNumber } from
'../../../../modules/isNumber.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testAnalyzeLengths(logger) {
	const cases = [
	{'code': 'prInt pos\nprint xyCor\nprint []\nprinT [5]\npriNt ["hi "yo]\nPRINT [', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
				'val': 'pos',
				'hasParentVal': 'prInt'
			},
			'length': 3
		},
		{
			'token': {
				'val': 'xyCor',
			},
			'length': 2
		},
		{
			'token': {
				'type': ParseTreeTokenType.LIST,
				'hasParentVal': 'print'
			},
			'length': 0
		},
		{
			'token': {
				'type': ParseTreeTokenType.LIST,
				'hasParentVal': 'prinT'
			},
			'length': 1
		},
		{
			'token': {
				'type': ParseTreeTokenType.LIST,
				'hasParentVal': 'priNt'
			},
			'length': 2
		},
		{
			// only 1 of the 2 required brackets is there so the code is not valid.
			// Nevertheless, analyzeLengths shouldn't throw an error and just calculate 0.
			'token': {
				'type': ParseTreeTokenType.LIST,
				'hasParentVal': 'PRINT'
			},
			'length': 0
		}
	]},
	{'code': 'make "x []\nprint :x', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'x'
			},
			'length': 0
		},
	]},
	{'code': 'make "x []\nprint :X\nqueue "x 5\nprint :x', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'X'
			},
			'length': 0
		},
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'x'
			},
			'length': 1
		},
	]},
	{'code': 'make "x []\nprint :X\nto p\nqueue "x 5\nend\nprint :x', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'X'
			},
			'length': 0
		},
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'x'
			},
			'length': 0
		},
	]},
	{'code': 'make "x []\nrepeat 2 [\nqueue "x 5]\nend\nprint :x', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'x'
			},
			'length': 2
		},
	]},
	{'code': 'make "x []\nrepeat 2 [\nprint "hi\nqueue "x 5\nprint "hello\n]\nend\nprint :x', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ,
				'val': 'x'
			},
			'length': 2
		},
	]},
	{
		'code': 'print mix [100] [] 0.5', 'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.LIST,
					'childrenLength': 2
				},
				'length': 0
			},
			{
				'token': {
					'type': ParseTreeTokenType.LIST,
					'childrenLength': 3
				},
				'length': 1
			}
		]
	},
	{
		'code': 'repeat 2 [\nprint item 1 "\n]', 'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.STRING_LITERAL,
					'val': ''
				},
				'length': 0
			},
		]
	},
	{
		'code': 'to addElement :mylist\nqueue2 "mylist 5\nend\nmake "mylist1 []\naddElement :mylist1\nprinT item 1 :mylist1',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.LIST,
					'childrenLength': 2,
					'hasParentVal': 'make'
				},
				'length': 0
			}
		]
	},
	{
		'code': `to p
	localmake "row []
	queue2 "row 3
end

make "list1 []
print item 1 :list1`,
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.VARIABLE_READ,
					'val': 'list1'
				},
				'length': 0
			}
		]
	},{
		'code': 'print (list 1 2 3 4 5)',
		'checks': [
		{
			'token': {
				'val': 'list'
			},
			'length': 5
		}
		]
	},{
		'code': 'print vectorScale [0 1] 2',
		'checks': [
		{
			'token': {
				'val': 'vectorScale'
			},
			'length': 2
		}
		]
	},{
		'code': 'print vectorScale pos 2',
		'checks': [
		{
			'token': {
				'val': 'vectorScale'
			},
			'length': 3
		}
		]
	},{
		'code': 'print vectorAdd :x [1 2 3 4]\nprint vectorADD [1 2 3] :x\nprint vectorSubtract [1] [2]',
		// variable x is undefined but we should still be able to calculate the lengths.
		'checks': [
		{
			'token': {
				'val': 'vectorAdd'
			},
			'length': 4
		},
		{
			'token': {
				'val': 'vectorADD'
			},
			'length': 3
		},
		{
			'token': {
				'val': 'vectorSubtract'
			},
			'length': 1
		}
		]
	},{
		'code': 'print sublist :x 5 5\nprint Sublist :x 5 6',
		// variable x is undefined but that shouldn't be a problem for analyzing result length.
		'checks': [
		{
			'token': {
				'val': 'sublist'
			},
			'length': 1
		},
		{
			'token': {
				'val': 'Sublist'
			},
			'length': 2
		}
		]
	},{
		'code': `to p
	localmake "numRadialDots 50
	localmake "dots []
	repeat 2 [
		repeat :numRadialDots [
			jumpForward 1
			queue "dots pos
		]
	]
	repeat count :dots [
		setPos item repcount :dots
	]
end`,
		'checks': [
			{
				'token': {
					'hasParentVal': 'count'
				},
				'notLength': 0
				// undefined or 100 are ok but 0 is not ok.
			}
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const tokens = cachedParseTree.getAllTokens();
		const tokenValues = cachedParseTree.getTokenValues();
		const result = analyzeLengths(cachedParseTree, tokenValues);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			const lengthInfo = result.get(token);
			if (checkInfo.notLength === lengthInfo)
				clogger(`Did not expected ${checkInfo.notLength} but got it`);
			else if (checkInfo.length === undefined) {
				if (lengthInfo !== undefined)
					clogger(`Expected not to find any length information but got ${lengthInfo}`);
			}
			else if (lengthInfo === undefined)
				clogger(`Expected to find length information but it was undefined`);
			else if (isNumber(checkInfo.length) && !isNumber(lengthInfo))
				clogger(`Expected to get a number as length but got ${lengthInfo}`);
			else if (isNumber(lengthInfo) && !isNumber(checkInfo.length))
				clogger(`Expected to get a length range object but got the number ${lengthInfo}`);
			else if (isNumber(lengthInfo) && isNumber(checkInfo.length)) {
				if (lengthInfo !== checkInfo.length)
					clogger(`Expected lengthInfo to be ${checkInfo.length} but got ${lengthInfo}`);
			}
		});
	});
};