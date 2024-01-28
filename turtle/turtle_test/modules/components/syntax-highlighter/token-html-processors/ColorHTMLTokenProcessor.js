import { AlphaColour } from '../../../AlphaColour.js';
await AlphaColour.asyncInit();

export class ColorHTMLTokenProcessor {
	static isApplicableTo(token) {
		if (!token.isStringLiteral())
			return false;
		return AlphaColour.isValidColourString(token.val);
	}

	static toHTML(token) {
		const c = new AlphaColour(token.val);
		let backgroundColor;
		let classes = 'string-literal color-literal';
		if (c.isDark()) {
			backgroundColor = 'black';
			classes += ' dark';
		}
		else {
			backgroundColor = 'white';
		}
		const sampleColor = c.to6DigitHTMLCode();
		const style = `style="background-image: linear-gradient(${sampleColor},${sampleColor}, ${backgroundColor})"`;
		return `<span class="${classes}" ${style}>${token.toString()}</span>`;
	}
};