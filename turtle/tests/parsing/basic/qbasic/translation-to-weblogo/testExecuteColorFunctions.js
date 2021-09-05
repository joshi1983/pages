import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

function toSigned(num) {
	return new Int32Array([num])[0];
}

export function testExecuteColorFunctions(logger) {
	const cases = [
	{'code': `print _rgb(1, 0, 0)`,
'messages': ['' + toSigned(0xff000001)]},
	{'code': `print _rgb(0, 1, 0)`,
'messages': ['' + toSigned(0xff000100)]},
	{'code': `print _rgb(0, 0, 1)`,
'messages': ['' + toSigned(0xff010000)]},
	{'code': `print _rgb32(0, 0, 1)`,
'messages': ['' + toSigned(0xff010000)]},
	{'code': `print _rgb32(4, 5, 6, 7)`, // 4 parameters means _rgb32 acts like the _rgba function.
'messages': ['' + toSigned(0x07060504)]},
	{'code': `print _rgb32(1)`, // from intensity(gray scale value)
'messages': ['' + toSigned(0xff010101)]},
	{'code': `print _rgb32(1,2)`, // intensity and alpha
'messages': ['' + toSigned(0x02010101)]},
	{'code': `print _rgba32(0, 0, 1, 255)`,
'messages': ['' + toSigned(0xff010000)]},
	{'code': `print _rgba32(1, 2, 3, 4)`,
'messages': ['' + toSigned(0x04030201)]},
	];
	processTranslateExecuteCases(cases, logger);
};