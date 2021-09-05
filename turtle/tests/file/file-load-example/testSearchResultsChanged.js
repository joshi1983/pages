import { exampleToDivCustomClick } from '../../../modules/file/file-load-example/exampleToDivCustomClick.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { noop } from '../../../modules/noop.js';
import { searchResultsChanged } from '../../../modules/file/file-load-example/searchResultsChanged.js';
const examples = await fetchJson('json/scriptExamples.json');

function mockExampleToDiv(example) {
	return exampleToDivCustomClick(example, noop);
}

export function testSearchResultsChanged(logger) {
	const container = document.createElement('div');
	let result = searchResultsChanged(container, []);
	if (result !== false)
		logger(`On comparing an empty container with [], expected false but got ${result}`);
	const oneResult = examples.slice(0, 1);
	result = searchResultsChanged(container, oneResult);
	if (result !== true)
		logger(`On comparing an empty container with [{the first example}], expected true but got ${result}`);

	container.appendChild(mockExampleToDiv(oneResult[0]));
	result = searchResultsChanged(container, oneResult);
	if (result !== false)
		logger(`Expected false but got ${result}`);
};