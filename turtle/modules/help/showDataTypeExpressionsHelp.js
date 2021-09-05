import { dataTypesExpressionExampleToDiv } from './dataTypesExpressionExampleToDiv.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
import { showDataTypesHelp } from './showDataTypesHelp.js';
const data = await fetchJson('json/dataTypesFormatExamples.json');
const html = await fetchText('content/help/logo-language-topics/help-data-type-expressions.html');
const options = {
	'showDataTypesHelp': showDataTypesHelp
};

export function showDataTypeExpressionsHelp(autoAddPushState) {
	if (autoAddPushState !== false) {
		PushStates.add(function() {
			showDataTypeExpressionsHelp(false);
		});
	}
	Dialog.show(html, 'WebLogo Datatype Expressions', undefined, undefined, {
		'groupId': DialogGroups.HELP
	});
	const examplesContainer = document.getElementById('data-type-examples');
	data.forEach(function(exampleInfo) {
		examplesContainer.appendChild(dataTypesExpressionExampleToDiv(exampleInfo, options));
	});
	processHelpLinks(document.querySelector('.dialog'));
};