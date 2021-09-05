import { Operators } from
'../../../../modules/parsing/other-languages/kojo/Operators.js';
import { sToTypeMap } from
'../../../../modules/parsing/other-languages/kojo/parsing/stringToTokenType.js';

const badExamples = [
	'"hi"', '3', 'true', 'false'
];

for (const s of sToTypeMap.keys()) {
	badExamples.push(s);
}
for (const op of Operators.getAll()) {
	badExamples.push(op.symbol);
	badExamples.push('x' + op.symbol);
	badExamples.push('x ' + op.symbol);
	badExamples.push('x ' + op.symbol + 'y');
	badExamples.push('x ' + op.symbol + ' y');
}

export { badExamples };