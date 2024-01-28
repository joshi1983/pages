import { fetchJson } from '../fetchJson.js';
const examples = await fetchJson('json/scriptExamples.json');

export async function processExampleCount(e) {
	if (e === undefined)
		e = document.rootElement;
	const elements = e.querySelectorAll('.weblogo-example-count');
	elements.forEach(function(element) {
		element.innerText = '' + examples.length;
	});
};