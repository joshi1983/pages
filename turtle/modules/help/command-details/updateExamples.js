import { highlightLogoSyntaxInCodeElement } from '../../components/syntax-highlighter/highlightLogoSyntaxInCodeElement.js';
import { processHelpLinks } from '../processHelpLinks.js';

export function updateExamples(commandPrimaryName) {
	fetch(`content/help/commands/${commandPrimaryName}.html`).
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
		container.style.display = 'block';
		const htmlParent = document.getElementById('command-detail-examples-content');
		htmlParent.innerHTML = html;
		htmlParent.querySelectorAll('code').forEach(c => c.classList.add('pastable'));
		processHelpLinks(htmlParent);
		const codes = htmlParent.querySelectorAll('code');
		codes.forEach(codeElement => highlightLogoSyntaxInCodeElement(codeElement));
	});
};