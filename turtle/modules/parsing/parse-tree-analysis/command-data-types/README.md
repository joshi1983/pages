The command-data-types directory contains modules that support the CommandDataTypes class.

Some of the code duplicates effort by code in the parsing/data-types directory.
This duplicated effort is made to improve performance.
Manipulating the data type information in string format can be faster than converting into more structured DataType subclasses and manipulating there.