const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const puzzleStrings = require("../controllers/puzzle-strings.js");

chai.use(chaiHttp);

suite("Functional Tests", function () {
    suite("test /solve endpoint", () => {
        test("should return a solution when one exists", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({
                    puzzle: puzzleStrings[1][0]
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.solution);
                    assert.equal(responseBody.solution, puzzleStrings[1][1]);

                    done();
                });
        });

        test("should return an error when required fields are missing", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({})
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Required field missing");

                    done();
                });
        });

        test("should return an error when puzzle string contains invalid characters", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({
                    puzzle: puzzleStrings[5][0]
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Invalid characters in puzzle");

                    done();
                });
        });

        test("should return an error when puzzle string has incorrect length", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({
                    puzzle: puzzleStrings[6][0]
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Expected puzzle to be 81 characters long");

                    done();
                });
        });

        test("should return an error when puzzle cannot be solved", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({
                    puzzle: puzzleStrings[7][0]
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Puzzle cannot be solved");

                    done();
                });
        });
    });

    suite("test /check endpoint", () => {
        test("should return that the placement is valid when placement does not violate sudoku rules", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "g9",
                    value: "1"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isTrue(responseBody.valid);

                    done();
                });
        });

        test("should return that the placement is invalid when single placement conflict exists", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "a2",
                    value: "1"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isFalse(responseBody.valid);
                    assert.lengthOf(responseBody.conflict, 1);

                    done();
                });
        });

        test("should return that the placement is invalid when multiple placement conflicts exists", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "c1",
                    value: "8"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isFalse(responseBody.valid);
                    assert.lengthOf(responseBody.conflict, 2);

                    done();
                });
        });

        test("should return that the placement is invalid when all placement conflicts exists", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "a2",
                    value: "5"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isFalse(responseBody.valid);
                    assert.lengthOf(responseBody.conflict, 3);

                    done();
                });
        });

        test("should return an error when required fields are missing", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({})
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Required field(s) missing");

                    done();
                });
        });

        test("should return an error when puzzle string contains invalid characters", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[5][0],
                    coordinate: "a2",
                    value: "5"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Invalid characters in puzzle");

                    done();
                });
        });

        test("should return an error when puzzle string has incorrect length", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[6][0],
                    coordinate: "a2",
                    value: "5"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Expected puzzle to be 81 characters long");

                    done();
                });
        });

        test("should return an error when placement coordinate is invalid", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "ab2",
                    value: "5"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Invalid coordinate");

                    done();
                });
        });

        test("should return an error when placement value is invalid", (done) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/check")
                .send({
                    puzzle: puzzleStrings[1][0],
                    coordinate: "a2",
                    value: "a"
                })
                .end(function (err, response) {
                    assert.equal(response.status, 200);
                    const responseBody = response.body
                    
                    assert.isDefined(responseBody.error);
                    assert.equal(responseBody.error, "Invalid value");

                    done();
                });
        });
    });
});