'use strict';

let cartItems = getCartItems(inputs);
let receiptItems = getReceiptItems(cartItems);

function getCartItems(inputs) {
  const allItems = loadAllItems();
  const promotions = loadPromotions();

  let cartItems = [];
  
  for(let i = 0; i < inputs.length; i++){
    if (isExist(inputs, allItems)){
      if(isDiscount(inputs, promotions)){
      }
    }
  }
}

