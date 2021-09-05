import { getStringSourceForToken } from '../../../modules/components/syntax-highlighter/getStringSourceForToken.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';

const incompleteLongStringToken1 = new ParseTreeToken('', null, 1, 0, ParseTreeTokenType.LONG_STRING_LITERAL, '');
incompleteLongStringToken1.isComplete = false;
const incompleteLongStringToken2 = new ParseTreeToken('hello\nend', null, 1, 2, ParseTreeTokenType.LONG_STRING_LITERAL, '\'hello\nend');
incompleteLongStringToken2.isComplete = false;

export function testGetStringSourceForToken(logger) {
	const cases = [
		{
			'code': 'print "Hello',
			'token': new ParseTreeToken("print", null, 0, 4, ParseTreeTokenType.PARAMETERIZED_GROUP),
			'index': 4,
			'result': "print"
		},
		{
			'code': 'print "Hello',
			'token': new ParseTreeToken("Hello", null, 0, 11, ParseTreeTokenType.STRING_LITERAL),
			'index': 11,
			'result': "\"Hello"
		},
		{
			'code': 'print 7',
			'token': new ParseTreeToken(7, null, 0, 6, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 6,
			'result': "7"
		},
		{
			'code': 'print 7.',
			'token': new ParseTreeToken(7, null, 0, 7, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 7,
			'result': "7."
		},
		{
			'code': 'print 007.',
			'token': new ParseTreeToken(7, null, 0, 9, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 9,
			'result': "007."
		},
		{
			'code': '007.',
			'token': new ParseTreeToken(7, null, 0, 3, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 3,
			'result': "007."
		},
		{
			'code': 'print 7.000',
			'token': new ParseTreeToken(7, null, 0, 10, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 10,
			'result': "7.000"
		},
		{
			'code': 'print 7.010',
			'token': new ParseTreeToken(7.01, null, 0, 10, ParseTreeTokenType.NUMBER_LITERAL),
			'index': 10,
			'result': "7.010"
		},
		{
			'code': 'print TRUE',
			'token': new ParseTreeToken(true, null, 0, 9, ParseTreeTokenType.BOOLEAN_LITERAL),
			'index': 9,
			'result': "TRUE"
		},
		{
			'code': 'print \'hi\'\n',
			'token': new ParseTreeToken('hi', null, 0, 9, ParseTreeTokenType.LONG_STRING_LITERAL),
			'index': 9,
			'result': "'hi'"
		},
		{
			'code': 'print \'\n\'',
			'token': new ParseTreeToken('\n', null, 0, 1, ParseTreeTokenType.LONG_STRING_LITERAL),
			'index': 8,
			'result': "'\n'"
		},
		{
			'code': 'print \'\n',
			'token': incompleteLongStringToken1,
			'index': 6,
			'result': "'"
		},
		{
			'code': '\'hello\nend',
			'token': incompleteLongStringToken2,
			'index': 9,
			'result': "'hello\nend"
		},
	];
	cases.forEach(function(caseInfo) {
		const result = getStringSourceForToken(caseInfo.token, caseInfo.index, caseInfo.code);
		if (result !== caseInfo.result)
			logger(`Expected "${caseInfo.result}" but got "${result}"`);
	});
};