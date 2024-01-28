function getPreviousMin(shapesContainer) {
	const first = shapesContainer.querySelector('.shape .index');
	if (first === null)
		return;
	return parseInt(first.innerText.trim());
}

function getPreviousMax(shapesContainer) {
	const all = shapesContainer.querySelectorAll('.shape .index');
	if (all.length === 0)
		return;
	const last = all[all.length - 1];
	return parseInt(last.innerText.trim());
}

export function isRefreshNeeded(shapesContainer, min, max) {
	if (getPreviousMin(shapesContainer) !== min)
		return true;
	if (getPreviousMax(shapesContainer) !== max)
		return true;
	return false;
};