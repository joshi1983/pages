import { flatten } from '../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testWithJSParser(logger) {
	const cases = [
		{'code': '', 'len': 1},
		{'code': '4', 'len': 2},
		{'code': 'console.log("3")', 'len': 9},
		{'code': '4+1', 'len': 4},
		{'code': '4+1*2', 'len': 6},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tree = parseResult.root;
		const allTokens = flatten(tree);
		if (allTokens.length !== caseInfo.len)
			plogger(`Expected length to be ${caseInfo.len} but got ${allTokens.length}`);
	});
}

export function testFlatten(logger) {
	wrapAndCall([
		testWithJSParser
	], logger);
};