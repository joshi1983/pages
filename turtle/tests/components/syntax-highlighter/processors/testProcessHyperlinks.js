import { processHyperlinks } from '../../../../modules/components/syntax-highlighter/processors/processHyperlinks.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testProcessHyperlinks(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': '2 < 5', 'out': '2 &lt; 5'},
	{'in': '; http://www.google.com',
	'out': '; <a href="http://www.google.com" target="_blank">http://www.google.com</a>'},
	{'in': '; http://www.google.com\n',
	'out': '; <a href="http://www.google.com" target="_blank">http://www.google.com</a>\n'},

	// An apostrophe can be in a valid URL.
	{'in': `; https://www.fotw.info/flags/ir'.html`,
	'out': `; <a href="https://www.fotw.info/flags/ir'.html" target="_blank">https://www.fotw.info/flags/ir'.html</a>`},
	
	// Although apostrophe can be in a valid URL, they're rarely in URL's and
	// we want to treat them as not part of a URL if it is likely contained in something that looks a lot like 
	// a string literal.  A commented string literal isn't a real string literal but the below case is more intuitive 
	// than if we linked to http://www.google.com' instead of http://www.google.com.
	{'in': `; print 'http://www.google.com'`,
	'out': `; print '<a href="http://www.google.com" target="_blank">http://www.google.com</a>'`},
	];
	testInOutPairs(cases, processHyperlinks, logger);
};