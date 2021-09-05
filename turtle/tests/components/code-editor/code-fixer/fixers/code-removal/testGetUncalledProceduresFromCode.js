import { getUncalledProceduresFromCode } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/code-removal/getUncalledProceduresFromCode.js';
import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';

export function testGetUncalledProceduresFromCode(logger) {
	const cases = [
		{'code': '', 'len': 0},
		{'code': 'fd 100', 'len': 0},
		{'code': 'to p\nend', 'len': 1, 'result': [{'from': 0, 'to': 1}]},
		{'code': 'to p\nend\nfd 100', 'len': 1, 'result': [{'from': 0, 'to': 1}]},
		{'code': 'to p\nend\np', 'len': 0},
		{'code': 'to f\n\n\nrepeat count :list2 [\nlocalmake "item item repcount :list2\n\nprint :item \n]\n\n\nend\nf',
		'len': 0},
		{'code': 'to f :x\n\nlocalmake "x 4\n\nend\nf 0', 'len': 0},
		{'code': 'to f :x\n\nprint "hi \nend\nf 0', 'len': 0},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = getUncalledProceduresFromCode(caseInfo.code);
		if (result.length !== caseInfo.len)
			plogger(`Expected length to be ${caseInfo.len} but got a length of ${result.length}`);
		else if (result.length > 0) {
			for (let i = 0; i < result.length; i++) {
				const interval = result[i];
				if ((typeof interval) !== 'object')
					plogger(`Expected an interval object but got ${interval}`);
				else {
					if (!Number.isInteger(interval.from))
						plogger(`Expected from to be an integer but got ${interval.from}`);
					if (!Number.isInteger(interval.to))
						plogger(`Expected "to" to be an integer but got ${interval.to}`);
					if (caseInfo.result instanceof Array && caseInfo.result.length > i) {
						const caseInfoInterval = caseInfo.result[i];
						if (caseInfoInterval.from !== interval.from)
							plogger(`Expected ${interval.from} but got ${caseInfoInterval.from}`);
						if (caseInfoInterval.to !== interval.to)
							plogger(`Expected ${interval.to} but got ${caseInfoInterval.to}`);
					}
				}
			}
		}
	});
};