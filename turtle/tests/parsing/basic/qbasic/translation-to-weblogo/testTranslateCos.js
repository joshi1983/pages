import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateCos(logger) {
	const cases = [
	{'in': 'print COS(A2)', 'out': 'print radCos :A2'},
	{'in': 'print COS(A2)+X0', 'out': 'print ( radCos :A2 ) + :X0'},
	{'in': 'print R*COS(A2)+X0', 'out': 'print :R * ( radCos :A2 ) + :X0'}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};