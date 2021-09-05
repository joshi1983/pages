import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { translatePitrifiedGoTurtleToWebLogo } from
'../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';
import { validateTokensByType } from '../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let goCode;
goCode = `package main`;

initGenericParsing(ParseTreeTokenType, parse, goCode, validateTokensByType, undefined, translatePitrifiedGoTurtleToWebLogo);