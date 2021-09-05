import { microALabelToQBasicLabel } from
'../../../../../modules/parsing/basic/micro-a/scanning/microALabelToQBasicLabel.js';
import { processScanTokensTestCases } from './processScanTokensTestCases.js';

export function testMicroALabelToQBasicLabel(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'label x', 'tokens': []}, // remove unused labels.
		{'code': 'label x label y', 'tokens': []},
		{'code': 'goto x', 'tokens': []}, // remove goto statements to undefined labels.
		{'code': 'gosub x', 'tokens': []}, // remove gosub statements to undefined labels too.
		{'code': 'label x\ngoto x',
			'tokens': ['10', ':', 'goto', '10']
			//rename labels to QBASIC labels.
		},
		{'code': 'label x\ngosub x',
			'tokens': ['10', ':', 'gosub', '10']
		},
		{'code': 'label x\nlabel y\ngoto x',
			'tokens': ['10', ':', 'goto', '10']
			//rename labels to QBASIC labels.
		},
		{'code': 'label x\nlabel y\ngoto x\ngoto y',
			'tokens': ['10', ':', '20', ':', 'goto', '10', 'goto', '20']
		},
		{'code': 'label x label y\ngoto x\ngoto y',
			'tokens': ['11', ':', '10', ':', 'goto', '11', 'goto', '10']
		}
	];
	processScanTokensTestCases(cases, microALabelToQBasicLabel, logger);
};