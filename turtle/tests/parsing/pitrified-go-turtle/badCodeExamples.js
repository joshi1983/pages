import { Operators } from
'../../../modules/parsing/pitrified-go-turtle/Operators.js';

export const badCodeExamples = [
	'<-chanInt > 0'
];

for (const info of Operators.getAll()) {
	badCodeExamples.push(info.symbol);
	badCodeExamples.push(info.symbol + info.symbol);
	badCodeExamples.push(info.symbol + ' ' + info.symbol);
}