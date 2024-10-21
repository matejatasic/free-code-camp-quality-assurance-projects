function ConvertHandler() {
  this.unitsMappers = {
    km: "mi",
    mi: "km",
    kg: "lbs",
    lbs: "kg",
    L: "gal",
    gal: "L"
  };
  this.metricUnits = [
    "km",
    "kg",
    "L"
  ];
  this.relationBetweenUnits = {
    km: 1.60934,
    mi: 1.60934,
    kg: 0.453592,
    lbs: 0.453592,
    L: 3.78541,
    gal: 3.78541
  };
  this.verboseUnitNames = {
    km: "kilometers",
    mi: "miles",
    kg: "kilograms",
    lbs: "pounds",
    L: "litres",
    gal: "gallons"
  }

  this.getNum = function(input) {
    const inputRegex = /^(\d+(\.\d+)?(\/\d+(\.\d+)?)?)([a-zA-Z]+)?$/;
    const invalidCharactersRegex = /[,\\+?!!#@$%^&*()`~_\-<>|]+/;
    const hasInvalidCharacters = invalidCharactersRegex.test(input);

    if (hasInvalidCharacters) {
      return "invalid number";
    }

    if (this.isDoubleFraction(input)) {
      return "invalid number";
    }

    const match = input.match(inputRegex);
    
    if (!match) {
      return 1;
    }
    
    if (match[0].includes("/")) {
      return eval(match[1]);
    }
    
    return parseFloat(match[1]);
  };

  this.isDoubleFraction = function(input) {
    let count = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === "/") {
        count++;
      }

      if (count === 2) {
        return true;
      }
    }

    return false;
  }
  
  this.getUnit = function(input) {
    const inputRegex = /([a-zA-Z]+)$/;
    const match = input.match(inputRegex);
    
    if (!match) {
      return "invalid unit";
    }
    
    let unit = match[0];

    if (!unit) {
      return "invalid unit"
    }
    
    unit = ["L", "l"].includes(unit) ? unit.toUpperCase() : unit.toLowerCase();
    
    if (!this.unitsMappers[unit]) {
      return "invalid unit";
    }
    
    return unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    return this.unitsMappers[initUnit];
  };

  this.spellOutUnit = function(unit) {
    return this.verboseUnitNames[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    let value;
    
    if (this.metricUnits.includes(initUnit)) {
      value = initNum / this.relationBetweenUnits[initUnit];
    }
    else {
      value = initNum * this.relationBetweenUnits[initUnit];
    }

    value = value.toFixed(5);

    return parseFloat(value);
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {   
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
