import { processComments } from '../../../../modules/components/syntax-highlighter/processors/processComments.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testProcessComments(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': ';', 'out': '<span class="comment">;</span>'},
	{'in': '; hello', 'out': '<span class="comment">; hello</span>'},
	{'in': '; 2 < 5', 'out': '<span class="comment">; 2 &lt; 5</span>'},
	];
	testInOutPairs(cases, processComments, logger);
};