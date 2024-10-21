const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite("convert endpoint tests", () => {
        test('Test GET /api/convert with valid input', function (done) {
            chai
              .request(server)
              .keepOpen()
              .get('/api/convert?input=10L')
              .end(function (err, response) {
                assert.equal(response.status, 200);
                const body = response.body

                assert.isDefined(body.initNum);
                assert.isDefined(body.initUnit);
                assert.isDefined(body.returnNum);
                assert.isDefined(body.returnUnit);
                assert.isDefined(body.string);

                done();
              });
        });

        test('Test GET /api/convert with invalid unit input', function (done) {
            chai
            .request(server)
            .keepOpen()
            .get('/api/convert?input=32g')
            .end(function (err, response) {
              assert.equal(response.status, 200);
              assert.equal(response.text, "invalid unit");

              done();
            });
        });

        test('Test GET /api/convert with invalid number input', function (done) {
          chai
          .request(server)
          .keepOpen()
          .get('/api/convert?input=3/7.2/4kg')
          .end(function (err, response) {
            assert.equal(response.status, 200);
            assert.equal(response.text, "invalid number");

            done();
          });
        });

        test('Test GET /api/convert with invalid number and unit input', function (done) {
          chai
          .request(server)
          .keepOpen()
          .get('/api/convert?input=3/7.2/4kilomegagram')
          .end(function (err, response) {
            assert.equal(response.status, 200);
            assert.equal(response.text, "invalid number and unit");

            done();
          });
        });

        test('Test GET /api/convert with only valid unit input', function (done) {
          chai
            .request(server)
            .keepOpen()
            .get('/api/convert?input=kg')
            .end(function (err, response) {
              assert.equal(response.status, 200);
              const body = response.body

              assert.isDefined(body.initNum);
              assert.isDefined(body.initUnit);
              assert.isDefined(body.returnNum);
              assert.isDefined(body.returnUnit);
              assert.isDefined(body.string);

              done();
            });
      });
    });
});
