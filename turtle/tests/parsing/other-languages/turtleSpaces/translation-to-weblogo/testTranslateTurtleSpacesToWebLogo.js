import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateTurtleSpacesToWebLogo } from
'../../../../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/translateTurtleSpacesToWebLogo.js';

export function testTranslateTurtleSpacesToWebLogo(logger) {
	const cases = [
		{'in': 'print |Hello World|',
			'out': "print 'Hello World'"
		}
	];
	testInOutPairs(cases, translateTurtleSpacesToWebLogo, logger);
};
