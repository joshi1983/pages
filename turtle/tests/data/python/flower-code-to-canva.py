# copied from: https://www.youtube.com/watch?v=zv7bY-Y9rDk
import turtle
import numpy as np
from numpy import pi, cos, sin, exp

screen = turtle.Screen()
screen.colormode(255)
screen.bgcolor("black")
turtle.tracer(0) # Disable auto update

t = turtle.Turtle()
t.hideturtle()

def draw_gradient_petal(cx, cy, th, scl, color1, color2, num_lines=50, num_segments=25, frc=1):
    angles = np.linspace(th - pi/4, th + frc*pi/4, num_lines, endpoint=False)

    for theta in angles:
        radius = scl * exp(-(theta - th)**2 * 5) # Gaussian centered at th

        for i in range(num_segments):
            Segment radii
            r1 = radius * i / num_segments
            r2 = radius * (i + 1) / num_segments

            Segment points
            x1 = cx + r1 * cos(theta)
            y1 = cy + r1 * sin(theta)
            x2 = cx + r2 * cos(theta)
            y2 = cy + r2 * sin(theta)

            #Interpolate color from color1 to color2
            t_ratio = i / num_segments
            r = int(color1[0] * (1 - t_ratio) + color2[0] * t_ratio)
            g = int(color1[1] * (1 - t_ratio) + color2[1] * t_ratio)
            b = int(color1[2] * (1 - t_ratio) + color2[2] * t_ratio)

            t.color(r, g, b)
            t.penup()
            t.goto(x1, y1)
            t.pendown()
            t.goto(x2, y2)

        turtle.update() # Update after full line

wd = 2; t.pensize(wd) #
t.goto(-10,-300); t.rt(-80)
t.pendown()
for i in range(10):
    t.color((15*i, 100+15*i, 0)) # Set turtle color to red using RGB
    t.circle(1000,(-1)**i*20)
    t.rt(90); t.fd(wd); t.lt(90)

t.pensize(6)
n = 14
for i in range(n):
    th = 2 * pi * i / n
    draw_gradient_petal(30*cos(th), 30*sin(th), th, 200, color1=(255, 255, 255), color2=(255,100,150))
draw_gradient_petal(30, 0, 0, 200, color1=(255, 255, 255), color2=(255,100,150), frc=0)
t.pu()

# Draw central part
t.pensize(2)
t.goto(50,0); t.pd()
t.color((0,0,0)); t.begin_fill(); t.circle(50); t.end_fill()
t.color((80, 20, 0))
for i in range(0,360,20):
    t.goto(25+25*np.cos(i*np.pi/180),25*np.sin(i*np.pi/180))
    t.circle(25)

t.pensize(4)
for i in range(3*n):
    th = 2 * pi * i /3/n
    draw_gradient_petal(45*cos(th), 45*sin(th), th, 40, color1=(100,0,40), color2=(255,70,150), num_lines=20, num_segments=10)

turtle.done()