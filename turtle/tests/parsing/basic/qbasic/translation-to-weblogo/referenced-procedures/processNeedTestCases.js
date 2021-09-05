import { parse } from
'../../../../../../modules/parsing/basic/qbasic/parse.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedF(f) {
	return function(code) {
		const parseResult = parse(code);
		return f(parseResult.root);
	};
}

export function processNeedTestCases(cases, f, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but found ${cases}`);
	if (typeof f !== 'function')
		throw new Error(`f must be a function but found ${f}`);
	testInOutPairs(cases, wrappedF(f), logger);
};