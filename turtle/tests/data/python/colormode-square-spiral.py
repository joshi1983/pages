# copied from: https://www.geeksforgeeks.org/python/turtle-colormode-function-in-python/
# import package
import turtle

# set the colormode to 255
turtle.colormode(255)
# set color
turtle.color(0,0,255)

# motion
for i in range(20):
    turtle.forward(2+2*i)
    turtle.right(90)

# set the colormode to 1.0
turtle.colormode(1.0)

# set color
turtle.color(1.0,0,0)

# motion
for i in range(20):
    turtle.forward(40+4*i)
    turtle.right(90)