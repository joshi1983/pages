import { isCompleteFloatingPointLiteral } from './isCompleteFloatingPointLiteral.js';
import { isCompleteIntegerLiteral } from './isCompleteIntegerLiteral.js';
import { isImaginaryNumberLiteral } from './isImaginaryNumberLiteral.js';

const checks = [
	isCompleteFloatingPointLiteral,
	isCompleteIntegerLiteral,	
	isImaginaryNumberLiteral
];

export function isCompleteNumberLiteral(s) {
	return checks.some(check => check(s));
};