import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteDim(logger) {
	const cases = [
	// The following test case is from:
	// https://teachschoolnepal.wordpress.com/2019/01/09/array-in-qbasic/
	{'code': `CLS
DIM name$(3)
name$(0) = "Ramesh"
name$(1) = "Ram"
name$(2) = "Bimal"
name$(3) = "Sunil"
PRINT name$(0), name$(3)
END`,
	'messages': ['Ramesh\tSunil']},

	// mostly copied from code at: https://en.wikibooks.org/wiki/QBasic/Arrays_and_Types#mw-content-text
	{'code': `DIM player1 AS playertype
player1.name = "Bob"
player1.score = 92
print player1.name
print player1.score`,
	'messages': ['Bob', '92']},
	{'code': `TYPE TestType
    dataElement AS _BYTE
END TYPE

DIM a(4) AS TestType

a(1).dataElement = 3
print a(1).dataElement`,
		'messages': ['3']
	},
	{'code': `CONST INC = 40

DIM x(1)
DIM y(1)
DIM z(1)

x(0) = 3
y(0) = 2
z(0) = 1
i = 0
print INC * (x(i) / z(i)) + 160`,
	'messages': ['280']}
	];
	processTranslateExecuteCases(cases, logger);
};