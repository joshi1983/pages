import { setInnerText } from './setInnerText.js';

export function setInnerTextOrRemove(node, s) {
	if (s === '')
		node.parentNode.removeChild(node);
	else
		setInnerText(node, s);
};