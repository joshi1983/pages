import { blurRatiosToSequentialAlphaRatios } from '../../../../modules/drawing/vector/animation/blurRatiosToSequentialAlphaRatios.js';
import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { isCloseEnough } from '../../../helpers/isCloseEnough.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testBlurRatiosToSequentialAlphaRatios(logger) {
	const cases = [
		{
			'in': [1],
			'out': [1]
		},
		{
			'in': [0.5, 0.5],
			'out': [1, 0.5]
		},
		{
			'in': [0.33, 0.33, 0.33],
			'out': [1, 0.5, 0.33333333]
		},
		{
			'in': [0.33, 0.33, 0.33],
			'out': [1, 0.5, 0.33333333]
		},
		{
			'in': [0.25, 0.25, 0.25, 0.25],
			'out': [1, 0.5, 0.333333333333, 0.25]
		},
		{
			'in': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
			'out': [1, 0.5, 0.3333333333, 0.25, 0.2, 0.1666666666667, 1/7, 1/8, 1/9, 0.1]
		}
	];
	cases.forEach(function(caseInfo) {
		const result = blurRatiosToSequentialAlphaRatios(caseInfo.in);
		const plogger = prefixWrapper('Failed case with input: ' + JSON.stringify(caseInfo.in), logger);
		if (result.length !== caseInfo.out.length)
			plogger(`Expected length to be ${caseInfo.out.length} but got ${result.length}`);
		else if (!DeepEquality.equals(caseInfo.out, result)) {
			for (let i = 0; i < result.length; i++) {
				const v = result[i];
				if (!isCloseEnough(v, caseInfo.out[i])) {
					plogger(`Expected ${caseInfo.out[i]} but got ${v} at index ${i}.  Actual result = ${JSON.stringify(result)}`);
					break;
				}
			}
		}
	});
};