import { LogoScanner } from
'../../../../modules/parsing/LogoScanner.js';
import { scrapeProcedures } from
'../../../../modules/parsing/parse-tree-analysis/scrapeProcedures.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateWebLogoShaderToJSShader } from
'../../../../modules/parsing/compiling/js-shader/translateWebLogoShaderToJSShader.js';

export function testTranslateWebLogoShaderToJSShader(logger) {
	const cases = [
		{
			'in': `to p :x :y
	output [0 0 0]
end`,
			'out': `function p(x, y) {
	return [0, 0, 0];
}`}, {
			'in': `to getColour :x :y
	output [0 0 0]
end`,
			'out': `function getColour(x, y) {
	return [0, 0, 0];
}`}, {
			'in': `to getColour :x :y
	output [:x * 255 / 100 :y * 255 / 100 0]
end`,
			'out': `function getColour(x, y) {
	return [x * 255 / 100, y * 255 / 100, 0];
}`}, {
			'in': `to getColour :x :y
	output [100 * hypot [:x :y] :y * 300 0]
end`,
			'out': `function getColour(x, y) {
	return [100 * Math.hypot(x, y), y * 300, 0];
}`},
	];
	cases.forEach(function(caseInfo) {
		const code = caseInfo.in;
		if (typeof code === 'string') {
			const tokens = LogoScanner.scan(code);
			const procs = scrapeProcedures(tokens);
			let name = 'getcolour';
			if (procs.indexOf(p => p.name === name) === -1) {
				name = procs[0].name;
			}
			caseInfo.inArgs = [code, name];
			caseInfo.in = undefined;
		}
	});
	testInOutPairs(cases, translateWebLogoShaderToJSShader, logger);
};