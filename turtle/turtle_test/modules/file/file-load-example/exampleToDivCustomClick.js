import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';

/*
This was separated from exampleToDiv because exampleToDiv depended on
Code.js and Dialog.js which are harder to unit-test with.
*/
export function exampleToDivCustomClick(example, clickCallback) {
	const result = document.createElement('div');
	const topDiv = document.createElement('div');
	topDiv.classList.add('top-row');
	const name = document.createElement('div');
	name.classList.add('name');
	name.innerText = example.name;
	result.setAttribute('title', 'Click to load "' + example.name + '"');
	result.classList.add('clickable');
	// so the full name is visible while hovering even if it gets cut short in the name element.
	const keywords = document.createElement('div');
	keywords.classList.add('keywords');
	example.searchKeywords.forEach(function(keyword) {
		const span = document.createElement('span');
		span.innerText = keyword;
		keywords.appendChild(span);
	});
	topDiv.appendChild(name);
	topDiv.appendChild(keywords);
	result.addEventListener('click', clickCallback);
	const displayDiv = ScriptExampleDisplayRepository.get(example.filename, true).div;
	result.appendChild(topDiv);
	result.appendChild(displayDiv);
	return result;
};