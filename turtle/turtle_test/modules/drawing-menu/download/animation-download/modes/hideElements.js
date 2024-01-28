export function hideElements(elements) {
	elements.forEach(function(element) {
		element.classList.remove('hidden');
	});
};