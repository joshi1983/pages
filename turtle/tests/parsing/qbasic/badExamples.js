import { specialValues } from
'../../../modules/parsing/qbasic/stringToTokenType.js';

const badExamples = specialValues.slice();
badExamples.push(
'do while',
'do until',
'do loop',
'loop while',
'loop until',
'end def',
'end function',
'end if',
'end sub',
'function f',
'f)'
);

export { badExamples };
