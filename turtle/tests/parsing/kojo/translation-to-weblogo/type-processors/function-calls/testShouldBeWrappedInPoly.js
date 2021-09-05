import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/kojo/parsing/parse.js';
import { shouldBeWrappedInPoly } from
'../../../../../../modules/parsing/kojo/translation-to-weblogo/type-processors/function-calls/shouldBeWrappedInPoly.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedShouldBeWrappedInPoly(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const matches = tokens.filter(shouldBeWrappedInPoly);
		if (matches.length > 1)
			logger(`Expected at most 1 matches but found ${matches.length}`);
		return matches.length === 1;
	};
}

export function testShouldBeWrappedInPoly(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'repeat(4) {}', 'out': false},
		{'in': 'repeat(x) {}', 'out': false},
		{'in': 'repeat(4) {forward(100)}', 'out': false},
		{'in': 'repeat(4) {forward(100);}', 'out': false},
		{'in': 'repeat(4) {forward(100);right(1)}', 'out': false},
		{'in': 'beginShape()\nrepeat(4) {forward(100);right(90)}', 'out': false},
		{'in': 'repeat(2) {forward(100);right(90)}', 'out': false},
		{'in': 'repeat(4) {forward(100);right(90)}', 'out': true},
		{'in': 'repeat(3) {forward(100);right(120)}', 'out': true},
		{'in': 'repeat(4) {forward(100);right()}', 'out': true},
		{'in': 'repeat(4) {forward(100);right}', 'out': true},
		{'in': 'repeat(8) {forward(100);right(45)}', 'out': true},
	];
	testInOutPairs(cases, wrappedShouldBeWrappedInPoly(logger), logger);
};