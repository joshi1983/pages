import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';
import { naiveStripCobolComments } from
'../../../modules/parsing/other-languages/cobol/naiveStripCobolComments.js';

const cobolExamples = await getContentFromReferenceArray('tests/data/cobol/index.json');

for (const code of cobolExamples.map(naiveStripCobolComments)) {
	cobolExamples.push(code);
}

export { cobolExamples };