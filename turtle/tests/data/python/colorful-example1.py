#!/usr/bin/env python3
import sys
import time
import turtle

t = turtle.Pen()
t.speed(0)
turtle.bgcolor('black')

sides = int(sys.argv[1])

colors = ['red', 'yellow', 'blue', 'orange',
          'green', 'purple', 'brown', 'white', 'grey', 'pink'][:sides]

for x in range(360):
    t.pencolor(colors[x % sides])
    t.forward(x * 3 / sides + x)
    t.left(360 / sides + 1)
    t.width(x * sides / 200)

print('done')

while True:
    time.sleep(10)