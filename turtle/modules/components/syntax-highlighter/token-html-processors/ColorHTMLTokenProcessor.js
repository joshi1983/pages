import { AlphaColour } from '../../../AlphaColour.js';
import { Command } from '../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
await AlphaColour.asyncInit();
await Command.asyncInit();

function isVariableStringReference(token) {
	const parent = token.parentNode;
	if (parent !== null &&
	parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parent.val);
		if (info !== undefined) {
			const args = info.args;
			const index = parent.children.indexOf(token);
			if (args.length <= index)
				return false;
			if (index === 0 && (info.primaryName === 'localmake' ||
			info.primaryName === 'make'))
				return true;

			const argInfo = args[index];
			return argInfo.refTypes !== undefined;
		}
	}
	return false;
}

export class ColorHTMLTokenProcessor {
	static isApplicableTo(token) {
		if (!token.isStringLiteral())
			return false;
		if (isVariableStringReference(token))
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