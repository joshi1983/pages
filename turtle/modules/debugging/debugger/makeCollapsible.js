export function makeCollapsible(div, toggleCallback) {
	if (!(div instanceof Element))
		throw new Error('div must be an Element');
	if (typeof toggleCallback !== 'function')
		throw new Error('toggleCallback must be a function');
	const h2 = div.querySelector(':scope > h2');
	if (h2 === null)
		throw new Error('The collapsible element must have an h2 as its direct child');

	const span = document.createElement('span');
	function toggleCollapse() {
		span.classList.toggle('fa-angle-right');
		span.classList.toggle('fa-angle-down');
		div.classList.toggle('collapsed');
		toggleCallback();
	}

	span.classList.add('fa', 'fa-angle-down');
	h2.prepend(span);
	h2.classList.add('clickable');
	h2.addEventListener('click', toggleCollapse);
}