// temp will refer to the placeholders of the html file whereas product as an argument will
// refer to the elements of the json file
// --replaceTemplate is a function-- 
module.exports = (temp, product) => {

    let output = temp.replace(/{%ProductName%}/g, product.productName);
    output = output.replace(/{%Image%}/g, product.image);
    output = output.replace(/{%Price%}/g, product.price);
    output = output.replace(/{%From%}/g, product.from);
    output = output.replace(/{%NutrientsName%}/g, product.nutrients);
    output = output.replace(/{%Quantity%}/g, product.quantity);
    output = output.replace(/{%Description%}/g, product.description);
    output = output.replace(/{%id%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NotOrganic%}/g, 'not-organic');

    return output;
}