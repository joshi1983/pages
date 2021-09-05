import { Colour } from '../../../Colour.js';
import { getTextPositionFromElement } from '../getTextPositionFromElement.js';
import { unwrapStringValue } from '../highlighters/unwrapStringValue.js';
await Colour.asyncInit();

export function processColorClick(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('color-literal') &&
		Colour.isValidColourString(unwrapStringValue(e.innerText)));
	if (elements.length === 1) {
		const e = elements[0];
		const innerText = e.innerText;
		const c = new Colour(unwrapStringValue(innerText));
		const pos = getTextPositionFromElement(e);
		const textarea = context.textarea;
		context.ColorSelectorDialog.showDialog('Color Literal', c, false).then(function(newColour) {
			const s = textarea.value;
			const lines = s.split('\n');
			const line = lines[pos[0]];
			const result = line.substring(0, pos[1] - innerText.length + 1) + '"' + newColour.to6DigitHTMLCode() + line.substring(pos[1] + 1);
			lines[pos[0]] = result;
			textarea.value = lines.join('\n');

			// let the syntax highlighter show the change.
			textarea.dispatchEvent(new Event("change"));
		});
		return false;
	}
};