import { codeToHTML } from '../../../modules/components/syntax-highlighter/codeToHTML.js';
import { Highlighter } from '../../../modules/components/syntax-highlighter/highlighters/Highlighter.js';

export function wrappedCodeToHTML(code, containerID, lineGroupOnly) {
	if (lineGroupOnly === undefined)
		lineGroupOnly = true;
	const result = codeToHTML(code, undefined, undefined, containerID).html;
	const div = document.createElement('div');
	div.innerHTML = result;
	if (lineGroupOnly === true) {
		const lineGroupSelector = Highlighter.getLineGroupIDSelector(containerID);
		const lineGroups = div.querySelectorAll(lineGroupSelector);
		if (lineGroups.length === 1)
			return lineGroups[0].innerHTML;
	}
	return result;
};