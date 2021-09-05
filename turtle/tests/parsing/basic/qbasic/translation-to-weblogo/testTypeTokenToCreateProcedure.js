import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { formatCode } from
'../../../../../modules/components/code-editor/format/formatCode.js';
import { getDescendentsOfType } from
'../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { typeTokenToCreateProcedure } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/typeTokenToCreateProcedure.js';

export function testTypeTokenToCreateProcedure(logger) {
	const cases = [
	{'code': `type T`,
'out': `to createT
	output createPList2 [ ]
end`},
// Invalid QBasic code but we want to make sure no exception 
// is thrown by the JavaScript anyway.

	{'code': `type T
end type`,
'out': `to createT
	output createPList2 [ ]
end`},
	{'code': `type T
	x as integer
end type`,
'out': `to createT
	output createPList2 [ [ "x 0 ] ]
end`},
	{'code': `type T
	x as string
end type`,
'out': `to createT
	output createPList2 [ [ "x " ] ]
end`},
	{'code': `type T
	x as integer,
	y as double
end type`,
'out': `to createT
	output createPList2 [ [ "x 0 ] [ "y 0 ] ]
end`},
	{'code': `type T
x(5) as integer`,
'out': `to createT
	output createPList2 [ [ "x [ 0 0 0 0 0 ] ] ]
end`}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const typeTokens = getDescendentsOfType(parseResult.root, ParseTreeTokenType.TYPE);
		const typeToken = findToken({'hasChildVal': 'T'}, typeTokens, plogger);
		if (typeToken === undefined)
			return;
		let result = typeTokenToCreateProcedure(typeToken, 'createT');
		if (typeof result !== 'string')
			plogger(`Expected a string result but found ${result}`);
		else {
			result = formatCode(result.trim());
			if (result !== caseInfo.out)
				assertEquals(caseInfo.out, result, plogger);
		}
	});
};