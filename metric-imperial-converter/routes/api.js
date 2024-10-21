'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.get("/api/convert", (request, response) => {
    if (!request.query.input) {
      response.send("invalid input");
    }
    
    let initNumber;
    let initUnit;

    initNumber = convertHandler.getNum(request.query.input);
    initUnit = convertHandler.getUnit(request.query.input);

    if (initNumber === "invalid number" && initUnit === "invalid unit") {
      response.send("invalid number and unit");
      
      return;
    }
    else if (initNumber === "invalid number") {
      response.send(initNumber);

      return;
    }
    else if (initUnit === "invalid unit") {
      response.send(initUnit);

      return;
    }

    const returnNumber = convertHandler.convert(initNumber, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);

    response.json({
      initNum: initNumber,
      initUnit: initUnit,
      returnNum: returnNumber,
      returnUnit: returnUnit,
      string: convertHandler.getString(
        initNumber,
        initUnit,
        returnNumber,
        returnUnit
      )
    })
  });
};
