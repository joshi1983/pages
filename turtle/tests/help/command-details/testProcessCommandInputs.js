import { escapeHTML } from '../../helpers/escapeHTML.js';
import { processCommandInputs } from '../../../modules/help/command-details/processCommandInputs.js';
import { setUpCommandDetailsDialogTest } from './setUpCommandDetailsDialogTest.js';
import { tearDownCommandDetailsDialogTest } from './tearDownCommandDetailsDialogTest.js';

export function testProcessCommandInputs(logger) {
	setUpCommandDetailsDialogTest();

	const mockCommandInfo = {
		'args': [{
			'name': 'x',
			'types': 'list<list<transparent>>'
		}
		]
	};
	processCommandInputs(mockCommandInfo);

	// make sure there are no &lt; or &gt; codes in e.
	const e = document.getElementById('command-inputs');
	const innerText = e.innerText;
	if (innerText.indexOf('&lt;') !== -1)
		logger(escapeHTML(`Not expected to find &lt; but found it in innerText: ${innerText}`));
	if (innerText.indexOf('&gt;') !== -1)
		logger(escapeHTML(`Not expected to find &gt; but found it in innerText: ${innerText}`));

	tearDownCommandDetailsDialogTest();
};