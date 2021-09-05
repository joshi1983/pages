import { fetchJson } from '../../../modules/fetchJson.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';
const exampleScripts = await fetchJson('json/scriptExamples.json');
await ZippedExamples.asyncInit();

const webLogoExamplesContent = [];
for (const exampleInfo of exampleScripts) {
	const filename = exampleInfo.filename;
	const content = ZippedExamples.getContentForFilename(filename);
	if (typeof content === 'string')
		webLogoExamplesContent.push(content);
}

export { webLogoExamplesContent };