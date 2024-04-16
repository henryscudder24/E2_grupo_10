from django.db import models
from datetime import datetime

# Create your models here.


class Category(models.Model):
    category_title = models.CharField(max_length=200)
    category_gif = models.CharField(max_length=200)
    category_description = models.TextField()  # make this the wysiwyg text field

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"{self.category_title}"


class RegularPizza(models.Model):
    # example row :: 1 topping , 5.00 , 7.00
    pizza_choice = models.CharField(max_length=200)
    small_price = models.DecimalField(max_digits=6, decimal_places=2)
    large_price = models.DecimalField(max_digits=6, decimal_places=2)
    category_description = models.TextField()  # make this the wysiwyg text field

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Normal : {self.pizza_choice}"


class SicilianPizza(models.Model):
    # example row :: 1 topping , 5.00 , 7.00
    pizza_choice = models.CharField(max_length=200)
    small_price = models.DecimalField(max_digits=6, decimal_places=2)
    large_price = models.DecimalField(max_digits=6, decimal_places=2)
    category_description = models.TextField()  # make this the wysiwyg text field

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Siciliana : {self.pizza_choice}"


class Toppings(models.Model):
    # example row :: Pepperoni
    topping_name = models.CharField(max_length=200)

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"{self.topping_name}"


class Sub(models.Model):
    # example row :: meatball , 5.00 , 6.50
    sub_filling = models.CharField(max_length=200)
    small_price = models.DecimalField(max_digits=6, decimal_places=2)
    large_price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Sandwich : {self.sub_filling}"


class Pasta(models.Model):
    dish_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"{self.dish_name}"


class Salad(models.Model):
    dish_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Ensalada: {self.dish_name}"


class DinnerPlatters(models.Model):
    dish_name = models.CharField(max_length=200)
    small_price = models.DecimalField(max_digits=6, decimal_places=2)
    large_price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Plato : {self.dish_name}"


class UserOrder(models.Model):
    username = models.CharField(max_length=200)  # who placed the order
    # this will be a string representation of the cart from localStorage
    order = models.TextField()
    price = models.DecimalField(
        max_digits=6, decimal_places=2)  # how much was the order
    time_of_order = models.DateTimeField(default=datetime.now, blank=True)
    delivered = models.BooleanField()

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Orden realizada por  : {self.username} , {self.time_of_order.date()} , {self.time_of_order.time().strftime('%H:%M:%S')}"


class SavedCarts(models.Model):
    username = models.CharField(max_length=200, primary_key=True)
    # this will be a string representation of the cart from localStorage
    cart = models.TextField()

    def __str__(self):
        # overriding the string method to get a good representation of it in string format
        return f"Guardado por {self.username}"
