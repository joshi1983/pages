import { Colour } from '../../../Colour.js';
import { getTextPositionFromElement } from '../getTextPositionFromElement.js';
import { unwrapStringValue } from '../highlighters/unwrapStringValue.js';
await Colour.asyncInit();

function getElement(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('color-literal') &&
		Colour.isValidColourString(unwrapStringValue(e.innerText)));
	if (elements.length === 1)
		return elements[0];
}

export class ColorClickProcessor {
	static process(elements, context) {
		const e = getElement(elements, context);
		if (e === undefined)
			return;
		const innerText = e.innerText;
		const c = new Colour(unwrapStringValue(innerText));
		const textarea = context.textarea;
		const highlighterElement = e.closest('.syntax-highlighter.visualization-container');
		const pos = getTextPositionFromElement(e, highlighterElement);
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

	static isApplicable(elements, context) {
		return getElement(elements, context) !== undefined;
	}

	static getPopupName() {
		return 'Edit Color';
	}
};