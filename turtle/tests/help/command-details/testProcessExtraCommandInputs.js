import { escapeHTML } from '../../helpers/escapeHTML.js';
import { processExtraCommandInputs } from '../../../modules/help/command-details/processExtraCommandInputs.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testProcessExtraCommandInputs(logger) {
	const cases = [
		{
			'types': undefined,
		},
		{
			'types': 'num',
			'out': 'number'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const mockInfo = {};
		if (caseInfo.types !== undefined) {
			mockInfo.extraArgsInfo = {
				'types': caseInfo.types
			};
		}
		const e = document.createElement('div');
		e.innerHTML = `<div id="command-inputs-extra">
			<span id="command-extra-inputs"></span>
		</div>`;
		document.body.appendChild(e);
		processExtraCommandInputs(mockInfo);

		if (caseInfo.out !== undefined) {
			const span = document.getElementById('command-extra-inputs');
			if (span.innerText !== caseInfo.out)
				plogger(escapeHTML(`Expected ${caseInfo.out} but got ${span.innerText}`));
		}
		// remove element
		e.remove();
	});
};