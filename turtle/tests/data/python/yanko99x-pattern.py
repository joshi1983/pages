# copied from a comment at:
# https://www.youtube.com/watch?v=DJt944p4-0Q
# The comment was from someone with the username yanko99x.

from turtle import *
from colorsys import hsv_to_rgb

colormode(1.0)
penup()
setposition(0, 0)
pendown()
speed(0)
bgcolor('black')
pensize(3)

n = 100
h = 0

for j in range(120):        
    for i in range(4):      
        color(hsv_to_rgb(h, 1, 1))
        h += 0.003
        circle(40 + i * 5, 90)
        forward(250)
        left(90)
    rt(10)

hideturtle()
done()