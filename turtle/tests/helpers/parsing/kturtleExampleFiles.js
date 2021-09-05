import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';

const kturtleIndex = await fetchJson('tests/data/logo-scripts/kturtle/index.json');
const kturtleExampleFiles = [];
for (const filename of kturtleIndex) {
	const content = await fetchText('tests/data/logo-scripts/kturtle/' + filename);
	kturtleExampleFiles.push(content);
}

export { kturtleExampleFiles };