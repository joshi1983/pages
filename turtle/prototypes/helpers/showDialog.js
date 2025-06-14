/*
This serves a similar purpose to modules/components/Dialog.js.
The difference that makes this better for prototypes is that 
showDialog.js has far fewer dependencies.
In particular, showDialog on state of the document.
*/

function closeDialog() {
	const dialog = document.querySelector('body > div.dialog');
	const backdrop = document.querySelector('body > div.dialog-backdrop');
	for (const element of [dialog, backdrop]) {
		if (element !== null)
			element.remove();
	}
}

function addBackdrop() {
	const div = document.createElement('div');
	div.classList.add('dialog-backdrop');
	document.body.appendChild(div);
}

function addDialogElement(title, html) {
	const div = document.createElement('div');
	const header = document.createElement('header');
	const titleDiv = document.createElement('div');
	div.classList.add('dialog');
	titleDiv.innerText = title;
	header.appendChild(titleDiv);
	div.appendChild(header);
	const body = document.createElement('div');
	body.innerHTML = html;
	div.appendChild(body);
	const footer = document.createElement('footer');
	const okButton = document.createElement('button');
	okButton.innerText = 'OK';
	okButton.addEventListener('click', closeDialog);
	footer.appendChild(okButton);
	div.appendChild(footer);

	document.body.appendChild(div);
}

export function showDialog(title, html) {
	if (typeof html !== 'string')
		throw new Error(`html must be a string but found ${html}`);
	if (html.indexOf('<') === -1)
		throw new Error(`html must contain < but not found in ${html}`);

	closeDialog(); // in case there is already a dialog open.
	addBackdrop();
	addDialogElement(...arguments);
};