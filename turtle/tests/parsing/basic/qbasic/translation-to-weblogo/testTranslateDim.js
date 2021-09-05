import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateDim(logger) {
	const cases = [
	{'in': `CONST INC = 40
DIM x(1)
DIM y(1)
DIM z(1)

x(0) = 3
y(0) = 2
z(0) = 1
i = 0
print INC * (x(i) / z(i)) + 160`,
	'out': `make "INC 40
make "x [ ]
make "y [ ]
make "z [ ]
setItem 1 "x 3
setItem 1 "y 2
setItem 1 "z 1
make "i 0
print :INC * ( ( item 1 + :i :x ) / ( item 1 + :i :z ) ) + 160`
	},{
		'in': 'DIM x as integer',
		'out': `make "x 0`
	},{
		'in': 'DIM x,y as integer',
		'out': `make "x 0
make "y 0`
	}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};