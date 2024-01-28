import { Dialog } from '../Dialog.js';
import { fetchText } from '../../fetchText.js';
const html = await fetchText('content/components/menu-dialog.html');

export function showMenuDialog(title, question, menuOptions) {
	if (!(menuOptions instanceof Array))
		throw new Error(`menuOptions must be an Array but got ${menuOptions}`);
	if (menuOptions.length < 2)
		throw new Error(`There must be at least 2 menu options but found ${menuOptions.length}`);
	Dialog.show(html, title, 300, 150);
	const questionElement = document.getElementById('menu-dialog-question');
	questionElement.innerText = question;
	const menuUL = document.getElementById('menu-dialog-options');
	menuOptions.forEach(function(menuOption) {
		const li = document.createElement('li');
		const span = document.createElement('span');
		span.classList.add('hyperlinked');
		if (menuOption.className !== undefined)
			span.classList.add(menuOption.className);
		span.innerText = menuOption.name;
		if (menuOption.iconClassName !== undefined) {
			const iconSpan = document.createElement('span');
			iconSpan.classList.add(...menuOption.iconClassName.split(' '));
			span.insertBefore(iconSpan, span.firstChild);
		}
		li.appendChild(span);
		if (typeof menuOption.callback !== 'function')
			throw new Error(`menuOption callback must be a function but found ${menuOption.callback}`);
		span.addEventListener('click', menuOption.callback);
		menuUL.appendChild(li);
	});
};