import { specialValues } from
'../../../modules/parsing/js-parsing/scanTokenToParseTreeToken.js';

const badExamples = specialValues.slice();
badExamples.push(
	'var var', 'let let', 'let const', 'let var',
	'const let', 'const var',
	'let let = 42;', 'var var = 42;');

export { badExamples };