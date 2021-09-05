import { specialValues } from
'../../../modules/parsing/js-parsing/scanTokenToParseTreeToken.js';

const badExamples = specialValues.slice();
badExamples.push('let let = 42;', 'var var = 42;');

export { badExamples };