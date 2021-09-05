# copied from:
# https://www.youtube.com/shorts/CcZLNf3vssQ
from turtle import *
from colorsys import *

tracer(10)
bgcolor('black')
pensize(2)
left(90)
up()
goto(0, -200)
down()

def draw_tree(length):
    if length < 5:
        return
    else:
        h = 0.3 - (length / 200) * 0.3
        color(hsv_to_rgb(h, 1, 1))
        forward(length)
        right(25)
        draw_tree(length * 0.75)
        left(50)
        draw_tree(length * 0.75)
        right(25)
        up()
        backward(length)
        down()

draw_tree(120)
done()