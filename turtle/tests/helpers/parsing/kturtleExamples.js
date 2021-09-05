import { fetchText } from '../../../modules/fetchText.js';
import { kturtleExampleFiles } from './kturtleExampleFiles.js';

const kturtleExamples = [];
for (let filename of kturtleExampleFiles) {
	const code = await fetchText('tests/data/python/' + filename);
	kturtleExamples.push(code);
}

export { kturtleExamples };