import { parse } from '../../qbasic/parse.js';
import { translateBBCBasicToQBasic } from './translateBBCBasicToQBasic.js';

export function bbcBasicParse(code) {
	return parse(translateBBCBasicToQBasic(code));
};