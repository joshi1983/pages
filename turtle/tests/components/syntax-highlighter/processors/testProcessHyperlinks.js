import { processHyperlinks } from '../../../../modules/components/syntax-highlighter/processors/processHyperlinks.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testProcessHyperlinks(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': '2 < 5', 'out': '2 &lt; 5'},
	{'in': '; http://www.google.com', 'out': '; <a href="http://www.google.com" target="_blank">http://www.google.com</a>'},
	{'in': '; http://www.google.com\n', 'out': '; <a href="http://www.google.com" target="_blank">http://www.google.com</a>\n'},
	];
	testInOutPairs(cases, processHyperlinks, logger);
};