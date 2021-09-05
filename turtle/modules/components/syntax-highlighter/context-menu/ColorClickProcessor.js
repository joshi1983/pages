import { AlphaColour } from '../../../AlphaColour.js';
import { Colour } from '../../../Colour.js';
import { getTextPositionFromElement } from '../getTextPositionFromElement.js';
import { shouldAllowAlpha } from './color-click-processor/shouldAllowAlpha.js';
import { unwrapStringValue } from '../highlighters/unwrapStringValue.js';
await Colour.asyncInit();

function getElement(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('color-literal') &&
		AlphaColour.isValidColourString(unwrapStringValue(e.innerText)));
	if (elements.length === 1)
		return elements[0];
}

export class ColorClickProcessor {
	static process(elements, context) {
		const e = getElement(elements, context);
		if (e === undefined)
			return;
		const innerText = e.innerText;
		const s = unwrapStringValue(innerText);
		const tree = context.getTree();
		let isAllowingAlpha = shouldAllowAlpha(e, tree);
		let c;
		if (Colour.canBeInterprettedAsColour(s))
			c = new Colour(s);
		else
			c = new AlphaColour(s);
		const textarea = context.textarea;
		const highlighterElement = e.closest('.syntax-highlighter.visualization-container');
		const pos = getTextPositionFromElement(e, highlighterElement);
		context.ColorSelectorDialog.showDialog('Color Literal', c, false, isAllowingAlpha).then(function(newColour) {
			const s = textarea.value;
			const lines = s.split('\n');
			const line = lines[pos[0]];
			const result = line.substring(0, pos[1] - innerText.length + 1) + '"' + newColour.toString() + line.substring(pos[1] + 1);
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