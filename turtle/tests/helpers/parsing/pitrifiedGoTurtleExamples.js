import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';
import { goExamples } from './goExamples.js';

const pitrifiedGoTurtleExamples = await getContentFromReferenceArray('tests/data/pitrified-go-turtle/index.json');

ArrayUtils.pushAll(pitrifiedGoTurtleExamples, goExamples);

export { pitrifiedGoTurtleExamples };