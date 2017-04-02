$(() => {

  // TODO wrap get call in a method

  $.ajax({
    method: "GET",
    url: "/api/orders"
  }).done((pending_orders) => {
    /*
    Create object to hold each order
    Structure is: {order_id: {
      id: {
        image_url: "/img/image-2.png",
        name: "Crostini", 
        quantity: 2
      }
    }}
    To get image: ordersObject.order_id.id.image_url
    */
    var ordersObject = {};
    for(let order of pending_orders) {
      if (!ordersObject[order.order_id]){
        ordersObject[order.order_id] = {};
      }
      ordersObject[order.order_id][order.id] =  {
          "image_url": order.image_url,
          "name": order.name,
          "quantity": order.quantity
        } 
    }
    console.log("-----", ordersObject)

    for (let index in ordersObject){
      $("section.orders-container").empty();
      let order = populateOrder(ordersObject[index]);
      $("section.orders-container").append(order);

      console.log("_-_-", ordersObject[index])
      for (let entry in ordersObject[index]){
        // createOrderItem(ordersObject[index][entry]);
        console.log("####", ordersObject[index][entry])
      }
    }
    
  });

  function populateOrder(orders){
    let totalQuantity = 0;
    for(let item in orders){
      totalQuantity += orders[item].quantity;
    }

    let $orderContainer = $("<div>").addClass("row");
    let $order = $("<div>").addClass("col-sm-8 col-sm-offset-2 order-row").appendTo($orderContainer);
    let $beforeSlide = $("<div>").addClass("before-slide").appendTo($order);
    let $verticalAlign = $("<div>").addClass("vertical-align").appendTo($beforeSlide);
    let $col2 = $("<div>").addClass("col-sm-2").appendTo($verticalAlign);
    $("<p>").addClass("items").text(totalQuantity + " ITEMS").appendTo($col2);
    let $orderTitle = $("<div>").addClass("col-sm-6 col-sm-offset-1 text-center").appendTo($verticalAlign);
    $("<p>").addClass("customer-order").text("customer order #1").appendTo($orderTitle);
    let $col3 = $("<div>").addClass("col-sm-3").appendTo($verticalAlign);
    $("<p>").addClass("time").text("8 MINUTES AGO").appendTo($col3);

    let $afterReveal = $("<div>").addClass("after-reveal").appendTo($order);
    for (let entry in orders){
      createOrderItem(orders[entry]).appendTo($afterReveal);
    }
    let $timeEstimateRow = $("<div>").addClass("row").appendTo($afterReveal);
    let $col4 = $("<div>").addClass("col-sm-12 text-center").appendTo($timeEstimateRow);
    let $form = $("<form>").addClass("estimated-time-form form-inline").appendTo($col4);
    let $input = $("<div>").addClass("input-group").appendTo($form);
    $("<input>").attr("type", "text").addClass("form-control")
    .attr("id", "estimated-time-input").attr("placeholder", "Estimated time (minutes)").appendTo($input);
    $("<button>").attr("type", "submit").addClass("btn").text("Submit").appendTo($form);
 
    let $hideArrow = $("<div>").addClass("col-sm-2 col-sm-offset-5 text-center").appendTo($order);
    $("<i>").addClass("fa fa-caret-down down-arrow").attr("aria-hidden", "true").appendTo($hideArrow);

    return $orderContainer;
  }

  function createOrderItem(item) {
    $orderItem = $("<div>").addClass("row vertical-align text-center");
    $col1 = $("<div>").addClass("col-sm-4").appendTo($orderItem);
    $("<img>").addClass("customer-item-img").attr("src", item.image_url).attr("alt", "menu-item-1").appendTo($col1);
    $col2 = $("<div>").addClass("col-sm-4").appendTo($orderItem);
    $("<p>").addClass("customer-item-name").text(item.name).appendTo($col2);
    $col3 = $("<div>").addClass("col-sm-4").appendTo($orderItem);
    $("<p>").addClass("customer-item-quantity").text("x" + item.quantity).appendTo($col3);    

    return $orderItem;
  }

  // $('MENU_ITEM').on('click', function(event){
  //   event.preventDefault();
  //   order_id = get order ID from data attribute

  //   $.ajax({
  //     method: "POST",
  //     url: "/api/orders",
  //     data: $(this).serialize()
  //   }).done(
  //     // TODO rediret to the GET /admin/orders/:id route
  //   );
  // });
  
  toggleCheckout();
});

function toggleCheckout(){
  $('.before-slide').on('click', function(){
    $(this).siblings('.after-reveal').slideToggle("400");
    var collapsed = $(this).siblings().find('i').hasClass('fa-caret-down');

    $('.before-slide').siblings().find('i').removeClass('fa-caret-up');
    $('.before-slide').siblings().find('i').addClass('fa-caret-down');
    if(collapsed)
        $(this).siblings().find('i').toggleClass('fa-caret-down fa-caret-up')
  });
}
