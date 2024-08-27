import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';
const exampleScripts = await fetchJson('json/scriptExamples.json');

const webLogoExamplesContent = [];
for (const exampleInfo of exampleScripts) {
	const filename = exampleInfo.filename;
	const content = await fetchText('./logo-scripts/' + filename);
	if (typeof content === 'string')
		webLogoExamplesContent.push(content);
}

export { webLogoExamplesContent };