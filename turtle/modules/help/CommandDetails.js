import { Command } from '../parsing/Command.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { populateTemplateUsingObject } from '../populateTemplateUsingObject.js';
import { processCommandInputs } from './command-details/processCommandInputs.js';
import { processCommandOutputs } from './command-details/processCommandOutputs.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
import { updateExamples } from './command-details/updateExamples.js';
await Command.asyncInit();

const commandDetailsHTML = await fetchText('content/help/logo-language-topics/command-details-template.html');

export class CommandDetails {
	static showDetails(commandName, autoAddPushState) {
		if (typeof commandName !== 'string')
			throw new Error('showDetails requires a string for commandName.');
		if (autoAddPushState !== false) {
			PushStates.add(function() {
				CommandDetails.showDetails(commandName, false);
			});
		}
		const commandInfo = Command.getCommandInfo(commandName);
		const html = populateTemplateUsingObject(commandDetailsHTML, commandInfo);
		Dialog.show(html, `${commandInfo.primaryName} Command Details`, undefined, undefined, {
			'className': 'command-details',
			'groupId': DialogGroups.HELP,
			'iconClass': 'dialog-icon command-icon'
		});
		const ul = document.getElementById('command-abbreviations');
		ul.innerHTML = '';
		const noCommandAbbreviationsStyle = document.getElementById('no-command-abbreviations').style;
		if (commandInfo.names.length === 0)
			noCommandAbbreviationsStyle.display = 'inline';
		else {
			noCommandAbbreviationsStyle.display = 'none';
			commandInfo.names.forEach(function(name) {
				const li = document.createElement('li');
				li.innerText = name;
				ul.appendChild(li);
			});
		}
		const inputsOutputs = document.getElementById('inputs-outputs');
		if (commandInfo.primaryName === 'to')
			inputsOutputs.classList.add('hidden');
		else {
			processCommandInputs(commandInfo);
			processCommandOutputs(commandInfo);
		}
		updateExamples(commandInfo.primaryName);
		processHelpLinks();
	}
};