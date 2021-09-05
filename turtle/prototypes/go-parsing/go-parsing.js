import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/other-languages/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/other-languages/pitrified-go-turtle/ParseTreeTokenType.js';
import { translatePitrifiedGoTurtleToWebLogo } from
'../../modules/parsing/other-languages/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';
import { validateTokensByType } from
'../../modules/parsing/other-languages/other-languages/pitrified-go-turtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let goCode;
goCode = `package main`;

initGenericParsing(ParseTreeTokenType, parse, goCode, validateTokensByType, undefined, translatePitrifiedGoTurtleToWebLogo);