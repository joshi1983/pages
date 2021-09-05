const regex = /^!@P[+-]$/i;

/*
Prescan commands are documented at:
https://www.ti99iuc.it/web/_archivio/73/download/Important%20Product%20Information%20for%20TI%20Extended%20Basic.pdf
*/
export function isPrescanCommand(s) {
	return regex.test(s);
};