#!/usr/bin/env python3

from turtle import Turtle, Screen, Shape, mainloop
import math
import locale
import unicodedata # Use to sort strings with accents, see strip_accents()
import time


### CONFIGURATION ###


COUNTRY_NAMES_FILENAME = "country_names"

DEFAULT_FAST_DRAW = True

USE_ALWAYS_VISIBLE_TURTLE_SHAPE = True

FLAG_BORDER_COL = 'black'
FLAG_DEFAULT_RATIO = 2/3  # preferred flag ratio size between width & height

FULLSCREEN = True

ct = Turtle()

screen = Screen()
if FULLSCREEN:
    screen.setup(width = 0.80, height = 0.80)

fast_draw = False

def prepare_drawing(x, y, rotation=0):
    ct.penup()
    ct.goto(x, y)
    ct.setheading(rotation)
    ct.pendown()

def rectangle(x, y, width, height, rotation=0):
    prepare_drawing(x, y, rotation)
    ct.forward(width)
    ct.right(90)
    ct.forward(height)
    ct.right(90)
    ct.forward(width)
    ct.right(90)
    ct.forward(height)

def rectangle_filled(x, y, width, height, rotation=0):
    ct.begin_fill()
    rectangle(x, y, width, height, rotation)
    ct.end_fill()

def cross(center_x, center_y, width):
    # Move on the cross left then draw
    prepare_drawing(center_x - (width / 2), center_y)
    ct.forward(width)
    # Move on the cross top then draw
    prepare_drawing(center_x, center_y + (width / 2))
    ct.right(90)
    ct.forward(width)


def vertical_strips(x, y, width, height, *colors):
    nc = len(colors)
    if nc <= 0:
        # TODO Better manage error here below
        print(func_name + ": Bad color value")
        return
    w = width / nc  # TODO round?
    for i in range(nc):
        ct.color(colors[i])
        rectangle_filled(x + i * w, y, w, height)

def horizontal_strips(x, y, width, height, *colors):
    nc = len(colors)
    h = height / nc  # TODO round?
    for i in range(nc):
        ct.color(colors[i])
        rectangle_filled(x, y - i * h, width, h)


def cross_filled(x, y, width, height,
                 cross_center_x_r, cross_center_y_r,
                 cross_width_r, cross_height_r, col):
    ct.color(col)
    w = width * cross_width_r
    h = height * cross_height_r
    x1 = x + width * cross_center_x_r - (w / 2)
    y1 = y - height * cross_center_y_r + (h / 2)
    rectangle_filled(x1, y, w, height)
    rectangle_filled(x, y1, width, h)

def rectangle_filled_color(x, y, width, height, color, rotation=0):
    ct.color(color)
    rectangle_filled(x, y, width, height, rotation)

def flag_Greece(x, y, width, height):
    b = '#0D5EAF'
    w = 'white'
    horizontal_strips(x, y, width, height, *([b, w] * 4 + [b]))
    rectangle_filled_color(x, y, width * 0.37, height * 5/9 - 1, b)
    cross_filled(x, y, width * 0.37, height * 5/9 - 1, 1/2, 1/2,
                 1/13.5/0.37, 1/9/(5/9), w)


class Flag(object):
    def __init__(self, country_code, ratio, drawing_func):
        self.country_code = country_code
        self.ratio = ratio
        self.drawing_func = drawing_func

    def draw(self, x, y, width, height):
        self.drawing_func(x, y, width, height)

    def draw_ratio(self, x, y, width):
        self.drawing_func(x, y, width, width * self.ratio)

# Dictionnary of all the flags (the key is the flag drawing function)
flags_dict = dict()
flags_dict[flag_Greece]        = Flag(300,  2/3 , flag_Greece)


def draw_all_flags(width, border, country_names=False, ratio=False):
    global flags_dict
    # Get window size
    window_width = screen.window_width()
    window_height = screen.window_height()
    flags_num = len(flags_dict)
    x_start = -(window_width / 2) + border # TODO rename border please
    y_start = (window_height / 2) - border
    flags_horiz_max = int((window_width - 2 * border) / width)
    border_inside = (window_width - (2 * border)) - (flags_horiz_max * width)
    border_inside /= (flags_horiz_max - 1)
    if border_inside < border:
        flags_horiz_max -= 1
        border_inside = (window_width - (2 * border)) - (flags_horiz_max * width)
        border_inside /= (flags_horiz_max - 1)
    x = x_start
    y = y_start
    for i in flags_dict:
        # Get the flag and draw it
        flag = flags_dict[i]
        if ratio:
            h = width * flag.ratio
            flag.draw_ratio(x, y, width)
        else:
            h = width * FLAG_DEFAULT_RATIO
            flag.draw(x, y, width, h)
        # Draw the flag border
        ct.color(FLAG_BORDER_COL) # TODO find a better way for color config
        rectangle(x, y, width, h)
        # Next flag
        x += width + border_inside
        if x > (window_width / 2) - border - width:
            x = x_start
            y -= width * 2/3 + border_inside # TODO 2/3 here is not so nice

### MAIN ###

def main():
    ct.speed(0)
    # Black border, red inside
    ct.color('black', 'red')
    # Pen thickness
    ct.pensize(1)

    draw_all_flags(160, 60, country_names=True, ratio=False)

    return "Ready"

if __name__ == "__main__":
    msg = main()
    mainloop()