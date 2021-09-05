import { elementToToken } from './elementToToken.js';

export function isConvertToAssetApplicableToAnchorElement(element, tree) {
	if (element.tagName !== 'A')
		return false;
	const stringLiteralElement = element.closest('.string-literal');
	if (stringLiteralElement === null)
		return false;
	if (stringLiteralElement.innerText.length - 2 > element.innerText.length)
		return false;

	return elementToToken(element, tree) !== undefined;
};