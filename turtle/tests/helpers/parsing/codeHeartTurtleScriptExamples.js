import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';

const codeHeartTurtleScriptExamples = [];
const filenames = await fetchJson('tests/data/logo-scripts/code-heart-turtlescript/index.json');
for (const filename of filenames) {
	codeHeartTurtleScriptExamples.push(await fetchText('tests/data/logo-scripts/code-heart-turtlescript/' + filename));
}

export { codeHeartTurtleScriptExamples };