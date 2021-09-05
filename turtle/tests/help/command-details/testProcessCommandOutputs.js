import { escapeHTML } from '../../helpers/escapeHTML.js';
import { processCommandOutputs } from '../../../modules/help/command-details/processCommandOutputs.js';
import { setUpCommandDetailsDialogTest } from './setUpCommandDetailsDialogTest.js';
import { tearDownCommandDetailsDialogTest } from './tearDownCommandDetailsDialogTest.js';

export function testProcessCommandOutputs(logger) {
	setUpCommandDetailsDialogTest();

	const mockCommandInfo = {
		'returnTypes': 'list<list<transparent>>'
	};
	processCommandOutputs(mockCommandInfo);

	// make sure there are no &lt; or &gt; codes in e.
	const e = document.getElementById('command-output-types');
	const innerText = e.innerText;
	if (innerText.indexOf('&lt;') !== -1)
		logger(escapeHTML(`Not expected to find &lt; but found it in innerText: ${innerText}`));
	if (innerText.indexOf('&gt;') !== -1)
		logger(escapeHTML(`Not expected to find &gt; but found it in innerText: ${innerText}`));

	tearDownCommandDetailsDialogTest();
};