import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { isCompleteNumberLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isCompleteNumberLiteral.js';
import { isBase10FloatLiteral, isHexFloatLiteral } from 
'../../../../modules/parsing/pitrified-go-turtle/scanning/isCompleteFloatingPointLiteral.js';
import { isBase10IntegerLiteral, isCompleteIntegerLiteral, isOctalIntegerLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isCompleteIntegerLiteral.js';
import { isMarkingEndOfToken } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

// a lot of these cases were copied from:
// https://go.dev/ref/spec
const base10IntegerLiterals = ['42', '4_2', '0600', '0_600',
	'170141183460469231731687303715884105727',
	'170_141183_460469_231731_687303_715884_105727'
];
const base10FloatLiterals = ['0.', '72.40', '072.40', '2.71828', '1.e+0', '6.67428e-11',
		'1E6', '.25', '.12345E+5', '1_5.', '0.15e+0_2'];
const octalIntegerLiterals = ['0o600', '0O600',

	// some extra underscores added to test that they work.
	'0o_3', '0O_3_4_5_6_7'
];
const hexFloatLiterals = ['0x1p-2', '0x2.p10', '0x1.Fp+0', '0X.8p-0', '0X_1FFFP-16'];
const invalidNumbers = [
	'_42', '42_', '4__2', '0_xBadFace',
	'0x15e-2', // This should be parsed and interpreted like 0x15E - 2
		// In other words, the - is a separate token, a binary operator.
		// The 2 is a separate token, a base 10 integer number literal.

	'0x.p1',        // invalid: mantissa has no digits
	'1p-2',         // invalid: p exponent requires hexadecimal mantissa
	'0x1.5e-2',     // invalid: hexadecimal mantissa requires p exponent
	'1_.5',         // invalid: _ must separate successive digits
	'1._5',         // invalid: _ must separate successive digits
	'1.5_e1',       // invalid: _ must separate successive digits
	'1.5e_1',       // invalid: _ must separate successive digits
	'1.5e1_',       // invalid: _ must separate successive digits
	'.E'
];
const invalidNumberCases = invalidNumbers.map(n => {
	return {'in': n, 'out': false}
});

const validIntegerNumbers = [
	'0xBadFace', '0xBad_Face',
	'0x_67_7a_2f_cc_40_c6', 
];
ArrayUtils.pushAll(validIntegerNumbers, base10IntegerLiterals);
ArrayUtils.pushAll(validIntegerNumbers, octalIntegerLiterals);

const validFloatNumbers = [
];
ArrayUtils.pushAll(validFloatNumbers, base10FloatLiterals);
ArrayUtils.pushAll(validFloatNumbers, hexFloatLiterals);

const validNumbers = validIntegerNumbers.concat(validFloatNumbers);
export { validNumbers };

function convertInvalidCases(invalids) {
	return invalids.map(invalid => {
		return {
			'in': invalid,
			'out': false
		};
	});
}

function convertValidCases(valids) {
	return valids.map(valid => {
		return {
			'in': valid,
			'out': true
		};
	});
}

function testGeneral(logger) {
	
	const cases = [];
	for (const num of validNumbers) {
		cases.push({
			'in': num,
			'out': true
		});
	}
	ArrayUtils.pushAll(cases, invalidNumberCases);
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
}

function testIsBase10FloatLiteral(logger) {
	const cases = [];
	for (const num of base10FloatLiterals) {
		cases.push({
			'in': num,
			'out': true
		});
	}
	ArrayUtils.pushAll(cases, invalidNumberCases);
	ArrayUtils.pushAll(cases, convertInvalidCases(validIntegerNumbers));

	testInOutPairs(cases, isBase10FloatLiteral, logger);
}

function testIsBase10IntegerLiteral(logger) {
	const cases = [];
	for (const num of base10IntegerLiterals) {
		cases.push({
			'in': num,
			'out': true
		});
	}
	ArrayUtils.pushAll(cases, convertInvalidCases(base10FloatLiterals));
	ArrayUtils.pushAll(cases, invalidNumberCases);

	testInOutPairs(cases, isBase10IntegerLiteral, logger);
}

function testIsCompleteIntegerLiteral(logger) {
	const cases = convertValidCases(validIntegerNumbers);
	ArrayUtils.pushAll(cases, invalidNumberCases);
	ArrayUtils.pushAll(cases, convertInvalidCases(validFloatNumbers));
	testInOutPairs(cases, isCompleteIntegerLiteral, logger);
}

function testIsHexFloatLiteral(logger) {
	const cases = convertValidCases(hexFloatLiterals);
	ArrayUtils.pushAll(cases, invalidNumberCases);
	ArrayUtils.pushAll(cases, convertInvalidCases(validIntegerNumbers));

	testInOutPairs(cases, isHexFloatLiteral, logger);
}

function testIsMarkingEndOfTokenForValidNumberLiterals(logger) {
	const cases = [];
	validFloatNumbers.concat(validIntegerNumbers).forEach(function(num) {
		for (let i = 1; i < num.length; i++) {
			cases.push({
				'inArgs': [num.substring(0, i), num[i]],
				'out': false
			});
		}
	});
	testInOutPairs(cases, isMarkingEndOfToken, logger);
}

function testIsOctalIntegerLiteral(logger) {
	const cases = [];
	for (const num of octalIntegerLiterals) {
		cases.push({
			'in': num,
			'out': true
		});
	}
	ArrayUtils.pushAll(cases, invalidNumberCases);
	testInOutPairs(cases, isOctalIntegerLiteral, logger);
}

export function testIsCompleteNumberLiteral(logger) {
	wrapAndCall([
		testGeneral,
		testIsBase10FloatLiteral,
		testIsBase10IntegerLiteral,
		testIsCompleteIntegerLiteral,
		testIsHexFloatLiteral,
		testIsMarkingEndOfTokenForValidNumberLiterals,
		testIsOctalIntegerLiteral
	], logger);
};