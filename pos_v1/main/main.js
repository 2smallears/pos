'use static'

let printReceipt = (inputs) => {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = getCartItems(inputs, allItems);
  let receiptItems = getReceiptItems(cartItems, promotions);
  let receipt = getReceipt(receiptItems);
  let receiptText = getReceiptText(receipt);

  console.log(receiptText);
}

let getCartItems = (inputs, allItems) => {

  let cartItems = [];

  for(let input of inputs){
    let inputContent = input.split('-');
    let barcode = inputContent[0];
    let count = parseFloat(inputContent[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count += count;
    } else {
      let item = allItems.find(item => item.barcode === barcode);

      cartItems.push({item, count});
    }
  }
  return cartItems;
}

let getReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subTotal, save} = discount(cartItem, promotionType);
    return  {receiptItem:cartItem, subTotal, save};
  });
}

let getPromotionType = (barcode, promotions) => {
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
}

let discount = (cartItem, getPromotionType) => {
  let freeItemCount = 0;
  if(getPromotionType === 'BUY_TWO_GET_ONE_FREE'){
    freeItemCount = Math.floor(cartItem.count / 3);
  }
  let itemPrice = cartItem.item.price * cartItem.count;
  let save = cartItem.item.price * freeItemCount;
  let subTotal = itemPrice - save;

  return {subTotal, save};
}

let getReceipt = (receiptItems) =>{
  let receipt = {};
  let total = 0;
  let saveTotal = 0;
  for(receiptItem of receiptItems){
    total += receiptItem.subTotal;
    saveTotal += receiptItem.save;
  }
  receipt.receiptItems = receiptItems;
  receipt.total = total;
  receipt.saveTotal = saveTotal;

  return receipt;
}

let getReceiptText = (receipt) => {
  let receiptText = `***<没钱赚商店>收据***
`;
  let receiptItems = receipt.receiptItems;

  for(let textItem of receiptItems){
    receiptText += `名称：${ textItem.receiptItem.item.name }，\
数量：${textItem.receiptItem.count}${textItem.receiptItem.item.unit}，\
单价：${formatMoney(textItem.receiptItem.item.price)}(元)，\
小计：${formatMoney(textItem.subTotal)}(元)
`;
  }
  receiptText += `----------------------
总计：` + formatMoney(receipt.total) + `(元)
节省：` + formatMoney(receipt.saveTotal) + `(元)
**********************`;

  return receiptText;
}

let formatMoney = (money) => {
  return money.toFixed(2);
}
