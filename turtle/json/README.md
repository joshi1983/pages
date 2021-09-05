# json directory

The json folder contains various .json files used by JavaScript for various purposes.

## colours.json 
lists raw data on all named or indexed colours that are supported by WebLogo.

## commands.json 
lists all supported commands.  These are used for parsing, static code analysis, and execution.
The commands are also documented at Help -> Command Index.

## generalHelpTopics.json
lists help topics with associated ids.  These id's referenced by the data-helpid attribute in HTML.

## keywords.json 
lists all keywords.  These are used during parsing and in documentation accessible from Help -> Keywords

## operators.json
lists all supported operators

## pageSizes.json
lists all standard page sizes.  These are used in the PostScript exporter.
Only the default letter size is used for now because it was the only size that could be tested with GhostScript.
The other sizes might be used later if we find a way to get them working with GhostScript or another PostScript testing tool.

## resolutions.json
lists resolutions used by an export feature that is accessed through the main menu from Drawing -> Download

## scriptExamples.json
lists various example .lgo scripts.  These examples can be loaded by clicking in the main menu File -> Load Example

## unsupportedCommands.json 
lists various commands from other Logo interpreters and why WebLogo isn't supporting them.  These reasons will hopefully be shown to users when they try running Logo code from tutorials or other interpreters in WebLogo.

## tutorial.json
lists pages of the tutorial accesssible from Help -> Tutorial