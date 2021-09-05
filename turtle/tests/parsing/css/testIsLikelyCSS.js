import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { cssExamples } from '../../helpers/parsing/cssExamples.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { isLikelyCSS } from
'../../../modules/parsing/css/isLikelyCSS.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';
await ZippedExamples.asyncInit();
const nonExamples = [];
ArrayUtils.pushAll(nonExamples, processingExamples);
const examples = await fetchJson('json/scriptExamples.json');

export function testIsLikelyCSS(logger) {
	const cases = [
		{'in': 'a{}', 'out': true},
		{'in': 'h1{}', 'out': true},
		{'in': 'h1 {}', 'out': true},
		{'in': 'H1 {}', 'out': true},
		{'in': 'h2 {}', 'out': true},
		{'in': 'footer {}', 'out': true},
		{'in': 'html {}', 'out': true},
		{'in': 'ol {}', 'out': true},
		{'in': 'p {}', 'out': true},
		{'in': 'span {}', 'out': true},
		{'in': 'ul {}', 'out': true},
		{'in': '#idSelector {}', 'out': true},
		{'in': '.classNameSelector {}', 'out': true},
		{'in': '@media (max-width: 600px) {}', 'out': true}
	];
	cssExamples.forEach(function(code) {
		if (code.indexOf('##NO_PARSE_SETTINGS##') === -1 &&
		code.length > 1) {
			cases.push({
				'in': code,
				'out': true
			});
		}
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	examples.forEach(function(exampleInfo) {
		const code = ZippedExamples.getContentForFilename(exampleInfo.filename);
		if (typeof code === 'string')
			cases.push({'in': code, 'out': false});
	});
	testInOutPairs(cases, isLikelyCSS, logger);
};