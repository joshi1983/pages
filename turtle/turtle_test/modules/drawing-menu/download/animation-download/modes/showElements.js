export function showElements(elements) {
	elements.forEach(function(element) {
		element.classList.add('hidden');
	});
};