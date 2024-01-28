function getElement(elements) {
	elements = elements.filter(e => e.tagName === 'A');
	if (elements.length === 1)
		return elements[0];
}

export class HyperlinkProcessor {
	static process(elements) {
		const element = getElement(elements);
		if (element !== undefined) {
			element.click();
			return false;
		}
	}

	static isApplicable(elements) {
		return getElement(elements) !== undefined;
	}

	static getPopupName() {
		return 'Open hyperlink';
	}
};