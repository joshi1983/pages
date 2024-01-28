export function downloadDataUrl(filename, dataUrl) {
	const a = document.createElement('a');
	a.setAttribute('download', filename);
	a.setAttribute('href', dataUrl);
	a.click();
};