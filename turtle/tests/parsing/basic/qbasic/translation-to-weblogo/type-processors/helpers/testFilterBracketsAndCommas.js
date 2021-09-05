import { filterBracketsAndCommas } from
'../../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { parse } from
'../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testFilterBracketsAndCommas(logger) {
	const cases = [
		{'code': '()', 'out': []},
		{'code': '(1)', 'out': ['1']},
		{'code': '(1,)', 'out': ['1']},
		{'code': '(1,2)', 'out': ['1', '2']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const firstChild = parseResult.root.children[0];
		if (firstChild === undefined) {
			plogger(`The test data requires a child token but none found.`);
			return;
		}
		const result = filterBracketsAndCommas(firstChild.children);
		const out = caseInfo.out;
		if (result.length !== out.length)
			plogger(`Result length expected to be ${caseInfo.out.length} but found ${result.length}. result vals are ${result.map(t => '' + t.val).join(',')}`);
		else {
			for (let i = 0; i < result.length; i++) {
				const resultTok = result[i];
				if (resultTok.val !== out[i]) {
					plogger(`At index ${i}, expected a val of ${out[i]} but found ${resultTok.val}`);
					break;
				}
			}
		}
	});
};