$(document).ready(function () {
  retrieve_saved_cart()

  if (window.location.href.indexOf("cart") > -1) {
    load_cart()
  }

  if (window.location.href.indexOf("view-orders") > -1) {
    order_list_functionality()
  }
});

function order_list_functionality() {
  onRowClick("orders_table", function (row) {
    var id = row.getElementsByTagName("td")[0].innerHTML;
    var csrftoken = getCookie('csrftoken');
    var user_is_super = check_user_super();
    if (user_is_super && row.classList.contains("mark-as-complete")) {
      var r = confirm("Quieres registrar la orden " + id + " como enviada?");
      if (r == true) {
        $.ajax({
          url: "/mark_order_as_delivered", // the endpoint
          type: "POST", // http method
          data: { id: id, csrfmiddlewaretoken: csrftoken },

          // EL OK
          success: function (json) {
            //validar
            row.classList.remove("table-danger");
            row.classList.add("table-success")
          },

          //validaciones
          error: function (xhr, errmsg, err) {
            //have this as another toast
            console.log("no")
          }
        });
      }
    }

  });
}

function check_user_super() {
  var return_value;
  $.ajax({
    url: "check_superuser",
    type: 'GET',
    success: function (res) {
      console.log("respuesta " + res)
      if (res == "True") {
        console.log("asignado")
        return_value = true;
      } else {
        return_value = false;
      }
    },
    async: false
  });
  return return_value
}

function add_to_cart(info) {

  display_notif("Agregar al carro", info);
  var cart_retrieved = localStorage.getItem("cart")
  if (cart_retrieved === null) {
    //nuevo carrito
    var cart = [info];
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    var cart = JSON.parse(cart_retrieved);
    cart.push(info)
    localStorage.setItem('cart', JSON.stringify(cart));
  }


}

function onRowClick(tableId, callback) {
  var table = document.getElementById(tableId),
    rows = table.getElementsByTagName("tr"),
    i;

  for (i = 0; i < rows.length; i++) {
    table.rows[i].onclick = function (row) { return function () { callback(row); }; }(table.rows[i]);
  }
}

function display_notif(type, info = "Sin info") {
  //errores-respuestas
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "70",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "500",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  switch (type) {
    case "add to cart":
      toastr.success(info.item_description + ': $' + info.price, 'Agregado al carrito');
      break;
    case "remove from cart":
      toastr.warning("Eliminado Correctamente " + info + " del carrito");
      break;
    case "new order":
      toastr.success("Orden enviada con éxito");
      break;
  }

}

function load_cart() {
  var table = document.getElementById('cart_body');
  table.innerHTML = ""; //limpiar la tabla - en desarrollo - fabian solar 
  document.getElementById('cart_heading').innerHTML = "Para eliminar del carrito, ház un click"
  var cart = JSON.parse(localStorage.getItem("cart"));
  var total = 0;
  if (cart !== null && cart.length > 0) {
    for (var i = 0; i < cart.length; i++) {

      var row = table.insertRow(-1);
      var item_number = row.insertCell(0);
      var item_description = row.insertCell(1);
      var item_price = row.insertCell(2);
      item_number.innerHTML = String(i + 1);
      item_description.innerHTML = cart[i].item_description;
      item_price.innerHTML = "£" + cart[i].price;

      total += cart[i].price
    }
    total = Math.round(total * 100) / 100
    localStorage.setItem('total_price', total);
    document.getElementById('total').innerHTML = "£" + localStorage.getItem("total_price")


    onRowClick("cart_body", function (row) {
      var value = row.getElementsByTagName("td")[0].innerHTML;
      var description = row.getElementsByTagName("td")[1].innerHTML;
      var r = confirm("Proceed to delete '" + description + "' from cart?");
      if (r == true) {
        document.getElementById("cart_body").deleteRow(value - 1);
        //edit the cart
        cart.splice(value - 1, 1) //this is how you remove elements from a list in javascript
        localStorage.setItem('cart', JSON.stringify(cart)); //change the elements in the cart in local storage
        display_notif("remove from cart", description)
        load_cart() //refresh the page
      }
    });
  } else {
    display_empty_cart()
  }
}

function format_toppings(topping_choices) {
  var toppings = ""
  var arrayLength = topping_choices.length;
  for (var i = 0; i < arrayLength; i++) {
    if (i == 0) {
      //first iteration
      toppings += topping_choices[i]
    } else {
      toppings += " + "
      toppings += topping_choices[i]
    }
  }
  return toppings
}

function pizza_toppings(number_of_toppings, type_of_pizza, price) {
  var last_valid_selection = null;

  $('#toppings_label')[0].innerHTML = "Choose " + String(number_of_toppings) + " topping(s) here"
  $('#select_toppings').change(function (event) {
    console.log($(this).val().length)
    console.log(number_of_toppings)
    if ($(this).val().length > number_of_toppings) {

      $(this).val(last_valid_selection);
    } else {
      last_valid_selection = $(this).val();
    }
  }); //

  $('#toppings_modal').modal('show');
  $("#submit_toppings").click(function () {
    var topping_choices = $('#select_toppings').val();


    $('#toppings_modal').modal('toggle');
    var info = {
      "item_description": type_of_pizza + " pizza with " + format_toppings(topping_choices),
      "price": price
    }
    add_to_cart(info)

  });
};

function close_modal() {
  $('#toppings_modal').modal('hide');
  $('#toppings_modal').modal('dispose');
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      /
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
} //

function display_empty_cart() {
  var table = document.getElementById('cart_body');
  table.innerHTML = "";
  document.getElementById('total').innerHTML = ""
  document.getElementById('cart_heading').innerHTML = "Cart is empty!"
  document.getElementById("checkout_button").disabled = true;

}

function clear_cart() {
  localStorage.removeItem("cart");
  localStorage.removeItem("total_price");

  display_empty_cart();
}

function checkout() {

  var cart = localStorage.getItem("cart")
  var price_of_cart = localStorage.getItem("total_price")
  var csrftoken = getCookie('csrftoken');

  console.log("Checkout was clicked so we now send it to the server!")
  $.ajax({
    url: "/checkout", // the endpoint
    type: "POST", // http method
    data: { cart: cart, price_of_cart: price_of_cart, csrfmiddlewaretoken: csrftoken }, // data sent with the post request

    // handle a successful response
    success: function (json) {
      display_notif("new order")
      clear_cart()
    },

    // handle a non-successful response
    error: function (xhr, errmsg, err) {
      //have this as another toast
      console.log("the server said no lol")

    }
  });

}

function logout() {
  var current_cart = localStorage.getItem("cart")
  var csrftoken = getCookie('csrftoken');
  $.ajax({
    url: "/save_cart", // the endpoint
    type: "POST", // http method
    data: { cart: current_cart, csrfmiddlewaretoken: csrftoken }, // data sent with the post request

    // handle a successful response
    success: function (json) {
      //clear the local storage
      localStorage.removeItem("cart"); //Clear the cart
      localStorage.setItem('cart_retrieved', false);
      window.location.href = "/logout";
    },

    // handle a non-successful response
    error: function (xhr, errmsg, err) {

      console.log("the server said no lol")

    }
  });

}

function retrieve_saved_cart() {
  if (localStorage.getItem("cart_retrieved") !== "true") {
    $.ajax({
      url: "retrieve_saved_cart",
      type: 'GET',
      success: function (res) {
        localStorage.setItem('cart_retrieved', true);
        localStorage.setItem("cart", res)
      }
    });
    //
  }
}
