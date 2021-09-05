import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateSkySphere(logger) {
	const cases = [
	{'in': 'background {}', 'out': ''},
	{'in': 'background {Red}', 'out': 'setScreenColor "#ff0000'},
	{'in': 'background {Blue}', 'out': 'setScreenColor "#0000ff'},
	{'in': 'sky_sphere {}', 'out': ''},
	{'in': 'sky_sphere { pigment {color Red}}', 'out': 'setScreenColor "#ff0000'},
	];
	testInOutPairs(cases, translate, logger);
};