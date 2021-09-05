import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateSphere(logger) {
	const cases = [
	{'in': 'sphere {}', 'out': 'sphere 100'},
	{'in': 'sphere {<1, 2, 3>}', 'out': 'jumpTo [ 1 2 3 ]\nsphere 100'},
	{'in': 'sphere {<10, 9, 8>}', 'out': 'jumpTo [ 10 9 8 ]\nsphere 100'},
	{'in': 'sphere {<1, 2, 3>, 200}', 'out': 'jumpTo [ 1 2 3 ]\nsphere 200'},
	{'in': 'sphere {x, 200}', 'out': 'jumpTo :x\nsphere 200'},
	{'in': 'sphere {x, y}', 'out': 'jumpTo :x\nsphere :y'},
	];
	testInOutPairs(cases, translate, logger);
};