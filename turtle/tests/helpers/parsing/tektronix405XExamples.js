import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const tektronix405XExamples = await getContentFromReferenceArray('tests/data/tektronix-405x-basic/index.json');

export { tektronix405XExamples };