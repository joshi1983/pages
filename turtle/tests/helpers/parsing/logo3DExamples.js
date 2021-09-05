import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';

const logo3DIndex = await fetchJson('tests/data/logo-scripts/logo-3d/index.json');
const logo3DExamples = [];
for (const filename of logo3DIndex) {
	const content = await fetchText('tests/data/logo-scripts/logo-3d/' + filename);
	logo3DExamples.push(content);
}

export { logo3DExamples };