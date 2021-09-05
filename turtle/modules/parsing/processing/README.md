You can interactively test the Processing parser by visiting /prototypes/processing-parsing/ 
in your web browser.

Recent versions of Java support enum and Java always supported abstract classes, abstract methods.
I couldn't see examples of Processing code using the abstract keyword on https://processing.org/, though.
If Processing examples ever show using enum or abstract methods in abstract classes, it would be nice to add 
those examples to tests/data/processing directory, parse tests, and get the 
modules/parsing/processing/parsing code to parse them in reasonable ways.
Until seeing those examples in official Processing documentation or running in Processing software, I don't want to support them because the way Java uses "enum" 
or abstract keyword could be different from how Processing could eventually do it.  
It would risk introducing complexity and confusion without strong enough benefit.