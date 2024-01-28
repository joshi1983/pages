export function refreshIndexColumnWidth(maxIndex, shapeExplorerElement) {
	if (maxIndex > 999)
		shapeExplorerElement.classList.add('large-index');
	else
		shapeExplorerElement.classList.remove('large-index');
};