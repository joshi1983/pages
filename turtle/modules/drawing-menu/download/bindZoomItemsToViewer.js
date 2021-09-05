const idSuffixToMethodName = [
	['zoom-in', 'zoomIn', 'Zoom In', 'Zoom in by 10%'],
	['nudge-in', 'nudgeIn', 'Nudge In', 'Zoom in by 1%'],
	['zoom-out', 'zoomOut', 'Zoom Out', 'Zoom out by 10%'],
	['nudge-out', 'nudgeOut', 'Nudge Out', 'Zoom out by 1%']
];

export function addZoomMenuItems(idPrefix) {
	let id = idPrefix	+ 'zoom';
	const e = document.getElementById(id);
	if (e === null)
		throw new Error(`Unable to find element with id ${id} in document`);
	const ul = document.createElement('ul');
	for (const [suffix, methodName, itemText, title] of idSuffixToMethodName) {
		const itemId = `${idPrefix}${suffix}`;
		const li = document.createElement('li');
		if (li === null)
			throw new Error(`Unable to find element with id ${itemId} in document`);
		li.innerText = itemText;
		li.setAttribute('title', title);
		li.setAttribute('id', itemId);
		ul.appendChild(li);
	}
	e.appendChild(ul);
};

export function bindZoomItemsToViewer(idPrefix, viewer) {
	addZoomMenuItems(idPrefix);
	for (const [suffix, methodName, itemText, title] of idSuffixToMethodName) {
		const item = document.getElementById(idPrefix + suffix);
		item.addEventListener('click', function() {
			viewer[methodName]();
		});
	}
};