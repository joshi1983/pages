/*
This does not have colIndex and lineIndex properties to keep things
more performant.

This is simpler than modules/parsing/generic-parsing-utilities/Token.js
because we don't need to explain where and why there are errors in the format.

WebLogo's instanceof command lets people use this data type language in WebLogo code
but that is too rarely used compared to every static code analysis of parsed that happens
while typing WebLogo code.
*/
export class DataTypeScanToken {
	constructor(s) {
		this.s = s;
	}
};