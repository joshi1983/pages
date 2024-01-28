import { charIndexToParseTreeTokenPosition } from '../../../parsing/charIndexToParseTreeTokenPosition.js';
import { ClipboardHelper } from '../../../ClipboardHelper.js';
import { findSpanAtLocation } from './findSpanAtLocation.js';

export function updateBracketHighlighting(pre, textarea, id, getTree, getAllTokens) {
	if (!(textarea instanceof Element))
		throw new Error(`textarea must be an Element.  Not: ${textarea}`);
	if (typeof id !== 'string')
		throw new Error(`id must be a string.  Not: ${id}`);
	if (typeof getTree !== 'function')
		throw new Error(`getTree must be a function.  Not: ${getTree}`);
	if (typeof getAllTokens !== 'function')
		throw new Error(`getAllTokens must be a function.  Not: ${getAllTokens}`);
	return function() {
		let pos = ClipboardHelper.getCursorPosition(textarea);
		let spans = pre.querySelectorAll(`span.highlighted`);
		spans.forEach(s => s.classList.remove('highlighted'));
		if (getTree() !== undefined && pos !== undefined && pos !== 0 && pos !== undefined) {
			pos--;
			const s = textarea.value;
			const ch = s.charAt(pos);
			if ('()[]'.indexOf(ch) !== -1) {
				pos = charIndexToParseTreeTokenPosition(pos, textarea.value);
				const nearToken = getAllTokens().filter(t => t.val === ch && t.lineIndex === pos.lineIndex && t.colIndex === pos.colIndex)[0];
				if (nearToken !== undefined) {
					const otherToken = nearToken.parentNode.children.filter(ct => ct.isBracket() && ct !== nearToken)[0];
					if (otherToken !== undefined) {
						const span1 = findSpanAtLocation(pre, nearToken);
						const span2 = findSpanAtLocation(pre, otherToken);
						if (span1 !== null)
							span1.classList.add('highlighted');
						if (span2 !== null)
							span2.classList.add('highlighted');
					}
				}
			}
		}
	};
};