import { charIndexToTabConsiderateIndex, indexOfWhitespace, lastIndexOfWhitespace } from '../../../../modules/components/code-editor/format/whitespaceUtils.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testCharIndexToTabConsiderateIndex(logger) {
	const cases = [
		{'s': '; Hello World', 'subcases': [
		// no tabs in s so return value should generally be same as index.
			{'index': 0, 'out': 0}, 
			{'index': 1, 'out': 1},
			{'index': 2, 'out': 2},
			{'index': 3, 'out': 3},
			{'index': 12, 'out': 12},
			{'index': 13, 'out': 13},
			{'index': 14, 'out': 13}
		]},
		{
			's': '; Hello\tWorld\t', 'subcases': [
				{'index': 0, 'out': 0},
				{'index': 1, 'out': 1},
				{'index': 7, 'out': 7},
				{'index': 8, 'out': 7},
				{'index': 9, 'out': 7},
				{'index': 10, 'out': 7},
				{'index': 11, 'out': 8},
			]
		}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const result = charIndexToTabConsiderateIndex(caseInfo.s, subcaseInfo.index);
			if (result !== subcaseInfo.out)
				logger('Given s="' + + '", index=' + subcaseInfo.index+', expected ' + subcaseInfo.out + ' but got ' + result);
		});
	});
}

function testIndexOfWhiteSpace(logger) {
	const cases = [
		{'s': 'hello world', 'subcases': [
			{
				'startIndex': 0,
				'out': 5
			},
			{
				'startIndex': 4,
				'out': 5
			},
			{
				'startIndex': 5,
				'out': 5
			},
			{
				'startIndex': 6,
				'out': -1
			},
			{
				'startIndex': 10,
				'out': -1
			},
			{
				'startIndex': 11,
				'out': -1
			},
			{
				'startIndex': 1000,
				'out': -1
			}
		]},
		{
			's': '\thello\t\tworld\r', 'subcases': [
				{
					'startIndex': 0,
					'out': 0
				},
				{
					'startIndex': 1,
					'out': 6
				},
				{
					'startIndex': 6,
					'out': 6
				},
				{
					'startIndex': 7,
					'out': 7
				},
				{
					'startIndex': 8,
					'out': 13
				},
			]
		},
		{
			's': '', 'subcases': [
			{
				'startIndex': 0,
				'out': -1
			}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const result = indexOfWhitespace(caseInfo.s, subcaseInfo.startIndex);
			if (result !== subcaseInfo.out)
				logger('For s="' + caseInfo.s + '" and startIndex=' + subcaseInfo.startIndex + ', expected ' + subcaseInfo.out + ' but got ' + result);
		});
	});
}

function testLastIndexOfWhitespace(logger) {
	const cases = [
		{'s': 'hello world', 'subcases': [
			{
				'maxIndex': 0,
				'out': -1
			},
			{
				'maxIndex': 4,
				'out': -1
			},
			{
				'maxIndex': 5,
				'out': 5
			},
			{
				'maxIndex': 6,
				'out': 5
			}
		]},
		{
			's': '\thello\t\tworld\r', 'subcases': [
				{
					'maxIndex': 0,
					'out': 0
				},
				{
					'maxIndex': 1,
					'out': 0
				},
				{
					'maxIndex': 6,
					'out': 6
				},
				{
					'maxIndex': 7,
					'out': 7
				}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const result = lastIndexOfWhitespace(caseInfo.s, subcaseInfo.maxIndex);
			if (result !== subcaseInfo.out)
				logger('For s="' + caseInfo.s + '" and maxIndex=' + subcaseInfo.maxIndex + ', expected ' + subcaseInfo.out + ' but got ' + result);
		});
	});
}

export function testWhitespaceUtils(logger) {
	wrapAndCall([
		testCharIndexToTabConsiderateIndex,
		testIndexOfWhiteSpace,
		testLastIndexOfWhitespace
	], logger);
};