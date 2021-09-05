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
	'messages': ['280']},
	{
'code': `DIM SHARED c(2)
c(1) = 3
print c(1)`, 'messages': ['3']
// The output here was tested to match output from QBASIC 1.1 using
// an emulator:
// https://archive.org/details/msdos_qbasic_megapack
},
	{
'code': `DIM SHARED c(2)
LET c(1) = 3
print c(1)`, 'messages': ['3']
// same as previous case but added "LET" before the c(1) =...
	},
	{
		'code': `DIM x as integer
print x`, 'messages': ['0']
	},
	{
		'code': `DIM x,y as integer
print x`, 'messages': ['0']
// the 0 output is what QBASIC 1.1 generates according to an emulator at:
// https://archive.org/details/msdos_qbasic_megapack
	},
	{
		'code': `DIM x as single
print x`, 'messages': ['0']
	},
	{
		'code': `DIM x as string
print x`, 'messages': ['']
	},
	{
		'code': `DIM x
print x`, 'messages': ['0']
	}
	];
	processTranslateExecuteCases(cases, logger);
};