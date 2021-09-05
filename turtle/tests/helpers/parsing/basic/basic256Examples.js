import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';
import { naiveStripBasic256Comments } from
'../../../../modules/parsing/other-languages/basic/basic-256/naiveStripBasic256Comments.js';

const basic256Examples = await getContentFromReferenceArray('tests/data/basic/basic-256/index.json');

for (const code of basic256Examples.map(naiveStripBasic256Comments)) {
	basic256Examples.push(code);
}

export { basic256Examples };