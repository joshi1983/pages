import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseTry(logger) {
	const cases = [
	{
		'code': 'try:\n\tprint(2)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
							]}
						]}
					]},
				]
			}]
		}
	},{
		'code': 'try:\n\tprint(x)\nexcept:\n\tprint("An exception occurred")',
		// The "except:" part means catch all exceptions regardless of class.
		'treeInfo': {
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]},
					{'val': 'except', 'type': ParseTreeTokenType.EXCEPT, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]}
				]
			}]
		}
	},{
		'code': `try:
	print(2/0)
except ZeroDivisionError:
	print("You can't divide by zero!")`,
		'treeInfo': {
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]},
					{'val': 'except', 'type': ParseTreeTokenType.EXCEPT, 'children': [
						{'val': 'ZeroDivisionError', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]}
				]
			}]
		}
	},{
		'code': `try:
	print "hi"
except:
	print "some exception handling"
finally:
    print "some finally code"`,
		'treeInfo': {
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'except', 'type': ParseTreeTokenType.EXCEPT, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'finally', 'type': ParseTreeTokenType.FINALLY, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]
			}]
		}
	},{
		'code': `try:

except (ValueError, ZeroDivisionError):
    print("There was an error")`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'except', 'type': ParseTreeTokenType.EXCEPT, 'children': [
						{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL}
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
					'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]},
				]
			}
			]
		}
	},{
		'code': `try:
    f = open(filename)

except OSError as e:
    if e.errno == errno.ENOENT:`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'try',
				'type': ParseTreeTokenType.TRY,
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'except', 'type': ParseTreeTokenType.EXCEPT, 'children': [
						{'val': 'as', 'type': ParseTreeTokenType.AS, 'children': [
							{'val': 'OSError', 'children': []},
							{'val': 'e', 'children': []}
						]}
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};