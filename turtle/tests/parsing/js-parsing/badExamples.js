import { specialValues } from
'../../../modules/parsing/js-parsing/scanTokenToParseTreeToken.js';

const badExamples = specialValues.slice();
badExamples.push(
	'var var', 'let let', 'let const', 'let var',
	'const let', 'const var',
	'let let = 42;', 'var var = 42;',
	'class x extends {',
	'++','--','+=','-=','/=',
	'x=',
	'x+=',
	'x-=',
	'x*=',
	'x/=',
	'const',
	'let',
	'var'
);

export { badExamples };