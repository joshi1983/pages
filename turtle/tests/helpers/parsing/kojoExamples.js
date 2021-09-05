import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

function stripFirstComments(s) {
	while (/^\s*\/\//.test(s)) {
		const index = s.indexOf('//');
		const newLineIndex = s.indexOf('\n', index);
		if (newLineIndex === -1)
			return s;
		s = s.substring(newLineIndex + 1);
	}
	return s;
}
const kojoExamples = await getContentFromReferenceArray('tests/data/kojo/index.json');

// We want to add versions of the downloaded examples that
// do not have the initial comments in them.
// This is because some isLikely... functions explicitly classify by patterns involving the // comment.
// The examples include initial comments crediting where they were copied or adapted from which
// makes them more commented than is typically found online.
// Removing those initial comments adds examples that are more similar to the kinds of Kojo frequently found online.
const processedExamples = [];
for (const code of kojoExamples) {
	const processedCode = stripFirstComments(code);
	if (code !== processedCode)
		processedExamples.push(processedCode);
}
ArrayUtils.pushAll(kojoExamples, processedExamples);

const scalaExamples = await getContentFromReferenceArray('tests/data/kojo/scala/index.json');
ArrayUtils.pushAll(kojoExamples, scalaExamples);

export { kojoExamples };