import { Command } from '../../parsing/Command.js';
import { getInternalProcedureCodeExample } from './getInternalProcedureCodeExample.js';
import { highlightLogoSyntaxInCodeElement } from '../../components/syntax-highlighter/highlightLogoSyntaxInCodeElement.js';
import { primaryNameToFileName } from './primaryNameToFileName.js';
import { processHelpLinks } from '../processHelpLinks.js';
import { updateExampleCount } from './updateExampleCount.js';

export function updateExamples(commandPrimaryName) {
	updateExampleCount(commandPrimaryName);
	fetch(`content/help/commands/${primaryNameToFileName(commandPrimaryName)}.html`).
		then(function(response) {
			if (response.status >= 400)
				return new Promise(function(resolve, reject) {
					resolve('');
				});
			return response.text();
		}).
		then(function(html) {
		if (!html)
			return;

		const container = document.getElementById('command-details-examples-container');
		// if the user manages to close the dialog or click out of
		// command details before fetch completes,
		// give up on updating the command's examples.
		if (container === null) 
			return;
		container.style.display = 'block';
		const htmlParent = document.getElementById('command-detail-examples-content');
		htmlParent.innerHTML = html;
		const info = Command.getCommandInfo(commandPrimaryName);
		if (info.commandGroup === 'internalProc' ||
		info.internalProcArgCount !== undefined)
			htmlParent.innerHTML += getInternalProcedureCodeExample(commandPrimaryName);

		htmlParent.querySelectorAll('code').forEach(c => c.classList.add('pastable'));
		processHelpLinks(htmlParent);
		const codes = htmlParent.querySelectorAll('code');
		codes.forEach(codeElement => highlightLogoSyntaxInCodeElement(codeElement));
	});
};