import { getEqualitiesInvolvingCommand } from '../getEqualitiesInvolvingCommand.js';
import { highlightLogoSyntaxInCodeElement } from
'../../components/syntax-highlighter/highlightLogoSyntaxInCodeElement.js';
import { processHelpLinks } from '../processHelpLinks.js';

export function updateEqualities(commandPrimaryName) {
	const container = document.getElementById('command-details-equalities-container');
	const equalities = getEqualitiesInvolvingCommand(commandPrimaryName);
	if (equalities.size !== 0) {
		container.style.display = 'block';
		const equalitiesContainer = document.getElementById('command-detail-equalities-content');
		equalitiesContainer.innerText = '';
		const codes = [];
		const showComments = equalities.some(e => e.length > 2);
		for (const equalityInfo of equalities) {
			const equalityElement = document.createElement('div');
			const codesElement = document.createElement('div');
			codesElement.classList.add('codes');
			for (let i = 0; i < 2; i++) {
				const codeElement = document.createElement('code');
				codeElement.innerText = equalityInfo[i];
				codes.push(codeElement);
				codesElement.appendChild(codeElement);
				if (i === 0) {
					const equalSign = document.createElement('div');
					equalSign.innerText = '=';
					codesElement.appendChild(equalSign);
				}
			}
			equalityElement.appendChild(codesElement);
			if (showComments) {
				const commentElement = document.createElement('div');
				if (equalityInfo.length > 2) {
					commentElement.innerText = equalityInfo[2];
				}
				equalityElement.appendChild(commentElement);
			}
			equalitiesContainer.appendChild(equalityElement);
		}
		processHelpLinks(equalitiesContainer);
		codes.forEach(codeElement => highlightLogoSyntaxInCodeElement(codeElement));
	}
};