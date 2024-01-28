import { elementToToken } from './convert-to-asset/elementToToken.js';
import { fetchText } from '../../../fetchText.js';
import { isConvertToAssetApplicableToAnchorElement } from './convert-to-asset/isConvertToAssetApplicableToAnchorElement.js';
const prefix = 'content/components/syntax-highlighter/convert-to-asset/';
const htmlSnippet1 = await fetchText(`${prefix}error-message-snippet1.html`);
const htmlSnippet2 = await fetchText(`${prefix}error-message-snippet2.html`);

function getElement(elements, context) {
	const tree = context.getTree();
	elements = elements.filter(e => isConvertToAssetApplicableToAnchorElement(e, tree));
	if (elements.length === 1)
		return elements[0];
}

export class ConvertToAssetProcessor {
	static async process(elements, context) {
		const tree = context.getTree();
		const element = getElement(elements, context);
		if (element !== undefined) {
			const innerText = element.innerText;
			const token = elementToToken(element, tree);
			const container = element.closest('.syntax-highlighter');
			const oldCode = container.innerText;
			try {
				await context.convertToAsset(oldCode, token);
				context.ToastMessages.success(`Remote resource from ${innerText} converted to an asset`, false);
			}
			catch (e) {
				console.error(e);
				if (context.CodeEditor.isVisible)
					context.CodeEditor.restore(); // make sure it isn't maximized so the command box message shows.
				context.CommandBoxMessages.error(`Failed to convert resource from ${innerText} to an asset. ${htmlSnippet1}${e}</p>${htmlSnippet2}`, true);
			}
		}
	}

	static isApplicable(elements, context) {
		return getElement(elements, context) !== undefined;
	}

	static getPopupName() {
		return 'Convert to Asset';
	}
};