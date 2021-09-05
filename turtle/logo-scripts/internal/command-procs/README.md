The command-procs directory is for WebLogo commands that are best implemented using WebLogo.

This will include commands that need to call user-implemented WebLogo procedures.
If no custom procedures are needed to run as part of a command, it is usually best to implement it completely in JavaScript.
If a custom procedure is needed, it is best to run them using the invoke command in this directory.

Some examples of commands that will benefit from implementation here are:
- sort.  Calls a procedure that implements how to compare the elements of a list.
https://fmslogo.sourceforge.io/manual/command-sort.html

- map.  Calls a procedure to map each element of a list to another value.
https://fmslogo.sourceforge.io/manual/command-map.html

- foreach.  
https://fmslogo.sourceforge.io/manual/command-foreach.html

- filter.
custom procedure to decide whether or not to include each element in the resulting list.

- find.
custom procedure to indicate whether or not a given element is what we're looking for.