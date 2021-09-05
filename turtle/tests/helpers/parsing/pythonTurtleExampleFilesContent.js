import { fetchText } from '../../../modules/fetchText.js';
import { pythonTurtleExampleFiles } from './pythonTurtleExampleFiles.js';

const pythonTurtleExampleFilesContent = [];
for (let filename of pythonTurtleExampleFiles) {
	pythonTurtleExampleFilesContent.push(await fetchText('tests/data/python/' + filename));
}

export { pythonTurtleExampleFilesContent };