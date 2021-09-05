import { escapeHTML } from '../../helpers/escapeHTML.js';
import { SelectiveHTMLSetter } from '../../../modules/components/syntax-highlighter/SelectiveHTMLSetter.js';

export function validateSelectiveHTMLSetter(setter, logger) {
	if (!(setter instanceof SelectiveHTMLSetter))
		return;
	if (setter.pastLines.length !== setter.lineDivs.length) {
		logger(`Expected pastLines and lineDivs to share the same length but pastLines.length = ${setter.pastLines.length}, lineDivs.length = ${setter.lineDivs.length}`);
	}
	else {
		for (let i = 0; i < setter.pastLines.length; i++) {
			const html = setter.pastLines[i];
			if (html !== setter.lineDivs[i].innerHTML) {
				logger(escapeHTML(`Expected lineDivs[${i}] to have innerHTML of '${html}' but got '${setter.lineDivs[i].innerHTML}'`));
			}
			if (setter.container.children[i] !== setter.lineDivs[i]) {
				logger(`Expected children[${i}] to equal lineDivs[${i}] but they're not equal`);
			}
		}
	}
	if (setter.container.children.length !== setter.pastLines.length) {
		logger(`Expected container.children.length to equal ${setter.pastLines.length} but got ${setter.container.children.length}`);
	}
	if (setter.pastLines.length === 0) {
		if (setter.container.firstChild !== null)
			logger(`Expected firstChild to be null but got ${setter.container.firstChild}`);
	}
};