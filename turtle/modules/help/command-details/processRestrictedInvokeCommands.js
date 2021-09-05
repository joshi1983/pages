import { getRestrictedCommandNames } from '../../parsing/isSupportedByHighOrderInvoke.js';

export function processRestrictedInvokeCommands(e) {
	if (e === undefined)
		e = document;
	const elements = e.querySelectorAll('.restricted-invoke-commands');
	const names = getRestrictedCommandNames();
	elements.forEach(function(div) {
		div.innerHTML = '';
		const numPerColumn = Math.ceil(names.length / 3);
		let ul;
		function processUl() {
			if (ul !== undefined)
				div.appendChild(ul);
			ul = document.createElement('ul');
		}
		names.forEach(function(name, index) {
			if (index % numPerColumn === 0) {
				processUl();
			}
			const li = document.createElement('li');
			const span = document.createElement('span');
			span.classList.add('command');
			span.innerText = name;
			li.appendChild(span);
			ul.appendChild(li);
		});
		processUl();
	});
};