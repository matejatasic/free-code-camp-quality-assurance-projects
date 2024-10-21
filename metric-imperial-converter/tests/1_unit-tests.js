const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
    suite("convertHandler tests", () => {
        suite("getNum tests", () => {
            test("should correctly read a whole number input", () => {
                assert.equal(convertHandler.getNum("2"), 2);
            });
    
            test("should correctly read a decimal number input", () => {
                assert.equal(convertHandler.getNum("2.5"), 2.5);
            });
    
            test("should correctly read a fractional input", () => {
                assert.equal(convertHandler.getNum("4/2"), 2);
            });
    
            test("should correctly read a fractional input with a decimal", () => {
                assert.equal(convertHandler.getNum("2/0.5"), 4);
            });
    
            test("should correctly return an error on a double-fraction", () => {
                assert.equal(convertHandler.getNum("3/2/3"), "invalid number");
            });
    
            test("should correctly default to a numerical input of 1 when no numerical input is provided", () => {
                assert.equal(convertHandler.getNum("kg"), 1);
            });
        });

        suite("getUnit tests", () => {
            test("should correctly read each valid input unit", () => {
                assert.equal(convertHandler.getUnit("2kg"), "kg");
            });

            test("should correctly return an error for an invalid input unit", () => {
                assert.equal(convertHandler.getUnit("10gram"), "invalid unit");
            });
        });

        suite("getReturnUnit tests", () => {
            test("should correctly read each valid input unit", () => {
                assert.equal(convertHandler.getReturnUnit("km"), "mi");
            });
        });

        suite("spellOutUnit tests", () => {
            test("should correctly return the spelled-out string unit for each valid input unit", () => {
                assert.equal(convertHandler.spellOutUnit("km"), "kilometers");
            });
        });

        suite("convert tests", () => {
            test("should correctly convert gal to L", () => {
                assert.approximately(convertHandler.convert(3, "gal"), 11.35623, 0.0001);
            });

            test("should correctly convert L to gal", () => {
                assert.approximately(convertHandler.convert(20, "L"), 5.28344, 0.0001);
            });
            
            test("should correctly convert mi to km", () => {
                assert.approximately(convertHandler.convert(3.1, "mi"), 4.98895, 0.0001);
            });

            test("should correctly convert km to mi", () => {
                assert.approximately(convertHandler.convert(0.5, "km"), 0.31069, 0.0001);
            });

            test("should correctly convert lbs to kg", () => {
                assert.approximately(convertHandler.convert(1.8, "lbs"), 0.81647, 0.0001);
            });

            test("should correctly convert kg to lbs", () => {
                assert.approximately(convertHandler.convert(1, "kg"), 2.20462, 0.0001);
            });
        });
    });
});