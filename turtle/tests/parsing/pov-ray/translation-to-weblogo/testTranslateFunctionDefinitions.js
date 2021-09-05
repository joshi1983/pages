import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateFunctionDefinitions(logger) {
	const cases = [
	{'in': '#declare foo = function { x + y * z }', 'out': `to foo :x :y :z
	output :x + :y * :z
end`},
	{'in': '#declare foo = function { #debug "hi" }', 'out': `to foo :x :y :z
	print "hi
end`},
	{'in': '#declare foo = function { #debug "hi world" }', 'out': `to foo :x :y :z
	print 'hi world'
end`},
	{'in': 'function { #debug "yo" }', 'out': `print "yo`},
	];
	testInOutPairs(cases, translate, logger);
};