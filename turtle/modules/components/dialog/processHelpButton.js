import { showGeneralHelpContent } from '../../help/showGeneralHelpContent.js';

export function processHelpButton(helpID) {
	const helpButton = document.getElementById('dialog-help');
	if (helpID) {
		helpButton.style.display = 'inline';
		helpButton.addEventListener('click', function() {
			showGeneralHelpContent(helpID);
		});
	}
	else
		helpButton.style.display = 'none';
};