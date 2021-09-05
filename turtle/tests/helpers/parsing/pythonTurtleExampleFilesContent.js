import { fetchText } from '../../../modules/fetchText.js';
import { pythonTurtleExampleFiles } from './pythonTurtleExampleFiles.js';

const pythonTurtleExampleFilesContent = [];
const pythonExamplesMap = new Map();
for (let filename of pythonTurtleExampleFiles) {
	const code = await fetchText('tests/data/python/' + filename);
	pythonTurtleExampleFilesContent.push(code);
	pythonExamplesMap.set(filename, code);
}

export { pythonExamplesMap };

export { pythonTurtleExampleFilesContent };