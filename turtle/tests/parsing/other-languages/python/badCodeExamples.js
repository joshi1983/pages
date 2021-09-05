import { PythonFunctions } from
'../../../../modules/parsing/other-languages/python/PythonFunctions.js';
import { PythonOperators } from
'../../../../modules/parsing/other-languages/python/PythonOperators.js';

const badCodeExamples = [
	'for', 'for x', 'for x in range',
	'for x in range(10)', 'for x in range(10):',
	'for x in range(10);', 'for _ in range(5):',
	'[x/24 for x in range(24)]',
	'for i in [x/24 for x in range(24)]:',
		'class', 'def', 'yield', 'return', 
		'(', ')', '[', ']', '{', '}', '#',
		'(]', '[)', '{]', '{)', '[}',
		'***', '===',
	'import turtle\nbla',
	'bla(',
	'bla)',
	'4:=3','x:=3',':=4',
	'turtle', 'turtle.', 'numpy', 'numpy.',
	'x=',
	'x=#',
	`print(side % (reverseDirection * 2) == 0)`,
`angle 119
side = 0
limit - 600
shape(angle, side, limit)`,
`import turtle
import random

angle 119
side = 0
limit - 600
shape(angle, side, limit)`
];

for (const funcInfo of PythonFunctions.getAllFunctions()) {
	const classNames = [];
	
	if (funcInfo.className !== undefined)
		classNames.push(funcInfo.classNames);
	if (funcInfo.classNames !== undefined)
		classNames.push(...funcInfo.classNames);

	for (const name of funcInfo.names) {
		badCodeExamples.push(name);
		badCodeExamples.push(`x.${name}`);
		for (const className of classNames) {
			badCodeExamples.push(`${className}.${funcInfo.name}`);
			badCodeExamples.push(`${className}.${funcInfo.name}()`);
		}
	}
}

for (const op of PythonOperators.getAll()) {
	badCodeExamples.push(op.symbol);
	badCodeExamples.push(`${op.symbol}x`);
	badCodeExamples.push(`${op.symbol} x`);
	badCodeExamples.push(`x${op.symbol}`);
	badCodeExamples.push(`x ${op.symbol}`);
	for (const op2 of PythonOperators.getAll()) {
		badCodeExamples.push(op.symbol + op2.symbol);
	}
}

export { badCodeExamples };