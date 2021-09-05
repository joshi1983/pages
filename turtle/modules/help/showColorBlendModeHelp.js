import { ColorBlendModes } from './ColorBlendModes.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
const colourBlendModesHTML = await fetchText('content/help/logo-language-topics/colour-blend-modes.html');

export function showColorBlendModeHelp(autoAddPushState) {
	if (autoAddPushState !== false) {
		PushStates.add(function() {
			showColorBlendModeHelp(false);
		});
	}
	Dialog.show(colourBlendModesHTML, 'Color Blend Modes', undefined, undefined, {
		'className': 'help-colour-blend-modes',
		'groupId': DialogGroups.HELP
	});
	ColorBlendModes.process();
	processHelpLinks();
};