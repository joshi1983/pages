import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const cheerfulNetherlandsExamplesAll =
await getContentFromReferenceArray('tests/data/logo-scripts/cheerful-netherlands-logo/index.json');

const cheerfulNetherlandsLogoExamples = cheerfulNetherlandsExamplesAll.filter(function(content) {
	const lines = content.split('\n');
	// if the content has too few lines, 
	// it isn't long enough to reliably be classified for most tests.
	if (lines.length < 2)
		return false;
	return true;
});
export { cheerfulNetherlandsLogoExamples, cheerfulNetherlandsExamplesAll };