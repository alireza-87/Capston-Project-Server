const csv = require('csv-parser');
const fs = require('fs');

const check_validity = (cardNumber, expiryMonth, expiryYear, cvv, delegate) => {
  var error = {message: "Invalid card"};
  fs.createReadStream('creditCards-mock.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      if (row["cardNumber"] === cardNumber && row["expiryMonth"] === expiryMonth && row["expiryYear"] === expiryYear && row["cvv"] === cvv){
        error = null;
      }
    })
    .on('end', () => {
      delegate(error, "Valid card");
    });
}

exports.check_validity = check_validity;