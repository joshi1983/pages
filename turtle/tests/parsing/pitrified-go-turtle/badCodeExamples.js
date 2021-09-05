import { Operators } from
'../../../modules/parsing/pitrified-go-turtle/Operators.js';
import { sToTypeMap } from
'../../../modules/parsing/pitrified-go-turtle/parsing/stringToTokenType.js';

export const badCodeExamples = [
	'<-chanInt > 0'
];

for (const s of sToTypeMap.keys()) {
	badCodeExamples.push(s);
}

for (const info of Operators.getAll()) {
	badCodeExamples.push(info.symbol);
	badCodeExamples.push(info.symbol + info.symbol);
	badCodeExamples.push(info.symbol + ' ' + info.symbol);
}