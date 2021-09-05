export function processHyperlink(elements) {
	elements = elements.filter(e => e.tagName === 'A');
	if (elements.length === 1) {
		elements[0].click();
		return false;
	}
};