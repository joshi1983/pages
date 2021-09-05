export function addFooterButton(buttonOptions, footerElement) {
	if (typeof buttonOptions.caption !== 'string')
		throw new Error('buttonOptions must have a caption string.');
	if (typeof buttonOptions.click !== 'function')
		throw new Error('buttonOptions must have a click function.');
	const button = document.createElement('button');
	button.innerText = buttonOptions.caption;
	if (typeof buttonOptions.title === 'string')
		button.setAttribute('title', buttonOptions.title);
	button.addEventListener('click', buttonOptions.click);
	footerElement.appendChild(button);
};