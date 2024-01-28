export function getBestOrientation(pdfDrawer) {
	if (pdfDrawer.height > pdfDrawer.width)
		return "p"; // portrait
	else
		return "l"; // landscape
};