# Denoising Directory

This directory contains code that improves feedback from parse tree analysis by bringing more focus to more helpful messages by removing less helpful ones.

Parse tree analysis outputs a lot of error messages.
Some are clearer than others.
Resolving 1 message can often resolve several others.
As a result of this hierarchy of clarity and importance, 
programmers and particularly beginner programmers benefit from having less clear and less important messages removed.
