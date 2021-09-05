# code from ChatGPT when asked to draw a bicycle in python turtle
import turtle

def draw_bicycle():
  # Draw frame
  turtle.penup()
  turtle.goto(-100,0)
  turtle.pendown()
  turtle.forward(200)
  turtle.right(90)
  turtle.forward(50)
  turtle.right(90)
  turtle.forward(100)
  turtle.left(90)
  turtle.forward(50)
  turtle.left(90)
  turtle.forward(100)
  
  # Draw wheels
  turtle.penup()
  turtle.goto(-75,0)
  turtle.pendown()
  turtle.circle(25)
  turtle.penup()
  turtle.goto(75,0)
  turtle.pendown()
  turtle.circle(25)
  
  # Draw handlebars
  turtle.penup()
  turtle.goto(100,50)
  turtle.pendown()
  turtle.right(90)
  turtle.forward(50)
  
  turtle.done()
  
draw_bicycle()