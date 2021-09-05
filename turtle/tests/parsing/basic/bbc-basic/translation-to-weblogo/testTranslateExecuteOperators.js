import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecuteOperators(logger) {
	const cases = [
		{'code': 'print &10', 'messages': ['16']},
		{'code': 'print ~10', 'messages': ['A']},

		{'code': 'print 2^3', 'messages': ['8']},
		{'code': 'PRINT 4^0.5', 'messages': ['2']},
		{'code': 'print 2+3', 'messages': ['5']},
		{'code': 'print 2-3', 'messages': ['-1']},
		{'code': 'print 2 - 3', 'messages': ['-1']},
		{'code': 'print 2*3', 'messages': ['6']},
		{'code': 'print 4 div 2', 'messages': ['2']},
		{'code': 'print 5 div 2', 'messages': ['2']},
		{'code': 'print 4 / 2', 'messages': ['2']},
		{'code': 'print 4 <> 2', 'messages': ['true']},
		{'code': 'print 2 <> 2', 'messages': ['false']},
		{'code': 'print 4 = 2', 'messages': ['false']},
		{'code': 'print 1 = 1', 'messages': ['true']},
		{'code': 'print 4 < 2', 'messages': ['false']},
		{'code': 'print 2 < 2', 'messages': ['false']},
		{'code': 'print 1 < 2', 'messages': ['true']},
		{'code': 'print 4 <= 2', 'messages': ['false']},
		{'code': 'print 2 <= 2', 'messages': ['true']},
		{'code': 'print 1 >= 2', 'messages': ['false']},
		{'code': 'print 4 >= 2', 'messages': ['true']},
		{'code': 'print 2 >= 2', 'messages': ['true']},
		{'code': `F=3
	F=-F
	PRINT F`, 'messages': ['-3']
	// unary -
	},

		// the following cases with math expressions should help find potential bugs involving
		// order of operation and operator precedence.
		{
			'code': 'PRINT 3 + 5 * 2',
			'messages': ['13']
			// copied from example at:
			// https://archive.org/details/bbcbasic0000coat/page/140/mode/2up?view=theater
			// That's page 140 of a book called 
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		},
		{
			'code': 'PRINT (3+5)*2',
			'messages': ['16']
			// copied from example at:
			// https://archive.org/details/bbcbasic0000coat/page/140/mode/2up?view=theater
			// That's page 140 of a book called 
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		},
		{
			'code': 'PRINT 8+20/2',
			'messages': ['18']
		},
		{
			'code': 'PRINT 9-4+2',
			'messages': ['7']
		},
		{
			'code': 'PRINT 12345/100',
			'messages': ['123.45']
			// case copied from https://archive.org/details/bbcbasic0000coat/page/142/mode/2up?view=theater
			// That's page 143 of a book.
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		}
	];
	processTranslateExecuteCases(cases, logger);
};