import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';
import { translateSeaTurtleToWebLogo } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/translation-to-weblogo/translateSeaTurtleToWebLogo.js';

export function testTranslateSeaTurtleToWebLogo(logger) {
	const cases = [
		{'in': 'forward 100', 'out': 'forward 100'},
		{'in': 'set x 123', 'out': 'make "x 123'},
		{'in': 'sub p\nend', 'out': 'to p\nend'},
		{'in': 'print 2 ^ 3', 'out': 'print power 2 3'},
		{'in': 'BACKGROUND GREEN', 'out': 'setScreenColor "green'},
		{'in': 'COLOR BLUE', 'out': 'setPenColor "blue'},
		{'in': 'BACKGROUND 0+1', 'out': 'setScreenColor "blue'},
	];
	testInOutPairs(cases, translateSeaTurtleToWebLogo, logger);
};
