import { Operators } from
'../../../../../modules/parsing/other-languages/pascal/turing/Operators.js';
import { specialValues } from
'../../../../../modules/parsing/other-languages/pascal/turing/scanTokenToParseTreeToken.js';

const badExamples = Array.from(specialValues);
for (const val of specialValues) {
	badExamples.push(val + ' ' + val);
}
for (const info of Operators.getAll()) {
	badExamples.push(info.symbol);
	badExamples.push(info.symbol + info.symbol);
	badExamples.push(info.symbol + ' ' + info.symbol);
}

export { badExamples };