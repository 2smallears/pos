'use strict';

function printReceipt(inputs){
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = getCartItems(inputs, allItems);
  let receiptItems = getReceiptItems(cartItems, promotions);
  let receipt = getReceipt(receiptItems);
  let receiptText = getReceiptText(receipt);
  console.log(receiptText);
}

function getCartItems(inputs, allItems) {
  let cartItems = [];

  for(let input of inputs){
    let inputContent = input.split('-');
    let barcode = inputContent[0];
    let count = parseFloat(inputContent[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count ++;
    } else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}

function getReceiptItems(cartItems, promotions) {
  let receiptitems = [];

  for(let cartItem of cartItems){
    let promotionBarcodes = promotions[0].barcodes;
    let barcode = cartItem.item.barcode;
    const discount = promotionBarcodes.find(promotionBarcode => promotionBarcode === barcode);
    //let promotion = promotions.find(promotion => promotion[0].barcode === cartItem.item.barcode);
    if(discount){
      let itemPrice = cartItem.item.price * cartItem.count;
      let save = parseFloat(Math.floor(cartItem.count / 3) * cartItem.item.price);
      let subTotal = parseFloat(itemPrice - save);
      receiptitems.push({receiptItem: cartItem, subTotal: subTotal, save:save});
    } else {
      let subTotal = parseFloat(cartItem.item.price * cartItem.count);
      let save = 0;
      receiptitems.push({receiptItem: cartItem, subTotal: subTotal, save:save});
    }

  }
  return receiptitems;
}

function getReceipt(receiptItems) {
  let receipt = {};
  var total = 0;
  var saveTotal = 0;
  for(let receiptItem of receiptItems){
    total += receiptItem.subTotal;
    saveTotal += receiptItem.save;
  }
  receipt.receiptItems = receiptItems;
  receipt.total = parseFloat(total);
  receipt.saveTotal = parseFloat(saveTotal);

  return receipt;
}

function getReceiptText(receipt) {
  let receiptText = `***<没钱赚商店>收据***\n`;
  let receiptItems = receipt.receiptItems;
  for (let textItem of receiptItems){
    receiptText += `名称：` + textItem.receiptItem.item.name + `，数量：` + textItem.receiptItem.count + textItem.receiptItem.item.unit + `，单价：` + textItem.receiptItem.item.price.toFixed(2) + `(元)，小计：` + textItem.subTotal.toFixed(2) + `(元)\n`;
  }
  receiptText += `----------------------
总计：` + receipt.total.toFixed(2) + `(元)
节省：` + receipt.saveTotal.toFixed(2) + `(元)
**********************`;

  return receiptText;
}