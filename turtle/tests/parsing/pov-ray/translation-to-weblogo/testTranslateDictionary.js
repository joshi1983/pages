import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateDictionary(logger) {
	const cases = [
	{'in': '#declare Fnord = dictionary', 'out': 'make "Fnord createPList'},
	{'in': `#declare Fnord = dictionary {
	  .Foo: 42
	}`, 'out': `make "Fnord createPList
setProperty "Fnord "Foo 42`},
	{'in': `#declare Fnord = dictionary {
	  ["Foo"]: 42
	}`, 'out': `make "Fnord createPList
setProperty "Fnord "Foo 42`}
	];
	testInOutPairs(cases, translate, logger);
};