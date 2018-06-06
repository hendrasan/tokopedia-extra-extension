chrome.extension.sendMessage({}, function(response) {
  setTimeout(init, 1000);
});

function init() {
  var observe = document.querySelector('._1AgQNQHv, ._1hoMwZCy, .category-products-all');
  var items = document.querySelectorAll('._33JN2R1i, ._2zW9OOW2, .product-card-category, .product-card, .shop-product, ._sdMeYlI');

  if (items) {
    Array.prototype.forEach.call(items, function(item, i){
      getItemStat(item);
    });
  }

  if (observe) {
    // Create a mutation observer to monitor the DOM for changes
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        Array.prototype.slice.call(mutation.addedNodes).forEach(function(el) {
          if (el.classList.contains('_33JN2R1i') || el.classList.contains('_2zW9OOW2') || el.classList.contains('product-card-category') || el.classList.contains('product-card') || el.classList.contains('_sdMeYlI')) {
            getItemStat(el);
          }
        });
      });
    });

    // Configure and start the observer
    observer.observe(observe, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
}

function getItemStat(item) {
  var pid;
  var element;

  pid = item.getAttribute('data-pid');

  if (!pid) {
    element = item.querySelector('div > span > button');
    if (element) {
      pid = element.value;
    }
  }

  if (!pid) {
    element = item.querySelector('.icheck');
    if (element) {
      pid = element.value;
    }
  }


  var url = 'https://js.tokopedia.com/productstats/check?pid=' + pid;

  axios.get(url)
    .then(function (response) {
      var str = response.data;
      var jsonString = JSON.parse(str.substring(str.indexOf('(') + 1, str.indexOf(')')));

      var el = item.querySelector('.vlEGRFVq, ._2AXi12hA, .product-summary, .detail, ._2Dq1BF0i > div:last-child');
      el.style.height = "130px";
      var html = '<div class="sold-count" style="color: #555555; font-size: 12px; line-height: 28px;"><i class="icon-shopping-cart-alt-2 mr-5"></i>Terjual: <strong>' + jsonString.item_sold + '</strong></div>';

      if (el && !item.querySelector('.sold-count')) {
        el.insertAdjacentHTML('beforeend', html);
      }
    });
}