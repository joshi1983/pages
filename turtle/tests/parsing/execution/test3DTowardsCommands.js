import { processExecuterTestCases } from './processExecuterTestCases.js';

export function test3DTowardsCommands(logger) {
	const cases = [
		/*{'code': `make "p [0 0 0]
setOrientation otowards :p
jumpForward distance :p
print pos`, 'messages': ['[0 0 0]']},*/
		{'code': `make "p [10 0 0]
setOrientation otowards :p
jumpForward distance :p
print pos`, 'messages': ['[10 0 0]']},/*
		{'code': `make "p [0 10 0]
setOrientation otowards :p
jumpForward distance :p
print pos`, 'messages': ['[0 10 0]']},*/
	];

	processExecuterTestCases(cases, logger);
};