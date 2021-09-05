# copied from
# https://www.youtube.com/watch?v=GKznl8NPBgI&t=196s
from turtle import *

speed(0)
setup(800, 500)
pensize(12)

# Black Ring
pencolor("black")
circle(80)

# Blue Ring
penup()
goto(-200, 0)
pendown()
pencolor("blue")
circle(80)

# Red Ring
penup()
goto(200, 0)
pendown()
pencolor("red")
circle(80)

# Yellow Ring
penup()
goto(-100, -100)
pendown()
pencolor("yellow")
circle(80)

# Green Ring
penup()
goto(100, -100)
pendown()
pencolor("green")
circle(80)