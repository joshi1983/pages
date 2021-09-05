import { hasACase } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/switch/hasACase.js';
import { parse } from
'../../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function wrappedHasACase(logger) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			logger(`With code ${code}, expected 1 child but got ${root.children.length}`);
		else {
			const switchToken = root.children[0];
			if (switchToken.type !== ParseTreeTokenType.SWITCH)
				logger(`With code ${code}, expected a SWITCH token but got type ${ParseTreeTokenType.getNameFor(switchToken.type)}`);
			else {
				return hasACase(switchToken);
			}
		}
		return false;
	};
}

export function testHasACase(logger) {
	const cases = [
	{'in': 'switch (1) {}', 'out': false},
	{'in': 'switch (1) {default: }', 'out': false},
	{'in': 'switch (1) {default: console.log("hi");}', 'out': false},
	{'in': 'switch (1) {case 1: console.log("hi");}', 'out': true},
	{'in': 'switch (1) {case 1: console.log("hi"); case 2: console.log("hello")}', 'out': true},
	];
	testInOutPairs(cases, wrappedHasACase(logger), logger);
};