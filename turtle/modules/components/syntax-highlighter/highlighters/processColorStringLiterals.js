import { AlphaColour } from '../../../AlphaColour.js';
import { unwrapStringValue } from './unwrapStringValue.js';
await AlphaColour.asyncInit();

export function processColorStringLiterals(container) {
	const spans = container.querySelectorAll('.string-literal[id]');
	for (let i = 0; i < spans.length; i++) {
		const span = spans[i];
		const val = unwrapStringValue(span.innerText);
		if (AlphaColour.isValidColourString(val)) {
			span.classList.add('color-literal');
			const c = new AlphaColour(val);
			let backgroundColor;
			if (c.isDark()) {
				backgroundColor = 'black';
				span.classList.add('dark');
			}
			else {
				backgroundColor = 'white';
				span.classList.remove('dark');
			}
			span.style.backgroundImage = `linear-gradient(${c.to6DigitHTMLCode()},${c.to6DigitHTMLCode()}, ${backgroundColor})`;
		}
	}
};