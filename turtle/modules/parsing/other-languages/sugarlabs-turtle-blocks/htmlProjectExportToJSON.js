export function htmlProjectExportToJSON(html) {
	const doc = document.implementation.createHTMLDocument();
	const div = doc.createElement('div');
	div.innerHTML = html;
	const codeElement = div.querySelector('.code');
	if (codeElement === null)
		return;
	const code = codeElement.innerText;
	if (typeof code !== 'string')
		return;
	return code;
};