/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const mongoose = require("mongoose");
const { Book } = require("../models.js");
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    /*
    * ----[EXAMPLE TEST]----
    * Each test should completely test the response of the API end-point including response status code!
    */
    test('#example Test GET /api/books', function (done) {
        chai.request(server)
            .get('/api/books')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'response should be an array');
                assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body[0], 'title', 'Books in array should contain title');
                assert.property(res.body[0], '_id', 'Books in array should contain _id');
                done();
            });
    });
    /*
    * ----[END of EXAMPLE TEST]----
    */

    suite('Routing tests', function () {


        suite('POST /api/books with title => create book object/expect book object', function () {

            test('Test POST /api/books with title', function (done) {
                const title = "Example title";

                chai
                    .request(server)
                    .keepOpen()
                    .post("/api/books")
                    .send({
                        title
                    })
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        const responseBody = response.body

                        assert.equal(title, responseBody.title);
                        assert.isDefined(responseBody._id);

                        done();
                    });
            });

            test('Test POST /api/books with no title given', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post("/api/books")
                    .send({})
                    .end(function (err, response) {
                        assert.equal(response.status, 200);

                        assert.equal(response.text, "missing required field title");

                        done();
                    });
            });

        });


        suite('GET /api/books => array of books', function () {

            test('Test GET /api/books', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .get("/api/books")
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        const body = response.body

                        assert.isArray(body);
                        assert.isNotEmpty(body);
                        body.forEach(book => {
                            assert.isDefined(book._id);
                            assert.isDefined(book.title);
                            assert.isDefined(book.commentcount);
                        })

                        done();
                    });
            });

        });


        suite('GET /api/books/[id] => book object with [id]', function () {

            test('Test GET /api/books/[id] with id not in db', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .get(`/api/books/${new mongoose.Types.ObjectId()}`)
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        assert.equal(response.text, "no book exists")

                        done();
                    });
            });

            test('Test GET /api/books/[id] with valid id in db', function (done) {
                Book.findOne({
                    title: "Example title"
                })
                    .then(document => {
                        chai
                            .request(server)
                            .keepOpen()
                            .get(`/api/books/${document._id}`)
                            .end(function (err, response) {
                                assert.equal(response.status, 200);
                                const body = response.body

                                assert.isDefined(body._id);
                                assert.isDefined(body.title);
                                assert.isDefined(body.comments);

                                done();
                            });
                    });
            });

        });


        suite('POST /api/books/[id] => add comment/expect book object with id', function () {

            test('Test POST /api/books/[id] with comment', function (done) {
                Book.findOne({
                    title: "Example title"
                })
                    .then(document => {
                        chai
                            .request(server)
                            .keepOpen()
                            .post(`/api/books/${document._id}`)
                            .send({
                                comment: "Some comment"
                            })
                            .end(function (err, response) {
                                assert.equal(response.status, 200);
                                const body = response.body
                                
                                assert.isDefined(body._id);
                                assert.isDefined(body.title);
                                assert.isDefined(body.comments);
                                assert.isAbove(body.comments.length, 0);

                                done();
                            });
                    });
            });

            test('Test POST /api/books/[id] without comment field', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post(`/api/books/${new mongoose.Types.ObjectId()}`)
                    .send({})
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        assert.equal(response.text, "missing required field comment")

                        done();
                    });
            });

            test('Test POST /api/books/[id] with comment, id not in db', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post(`/api/books/${new mongoose.Types.ObjectId()}`)
                    .send({
                        comment: "Some title",
                    })
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        assert.equal(response.text, "no book exists")

                        done();
                    });
            });

        });

        suite('DELETE /api/books/[id] => delete book object id', function () {

            test('Test DELETE /api/books/[id] with valid id in db', function (done) {
                Book.findOne({
                    title: "Example title"
                })
                    .then(document => {
                        chai
                            .request(server)
                            .keepOpen()
                            .delete(`/api/books/${document._id}`)
                            .end(function (err, response) {
                                assert.equal(response.status, 200);

                                assert.equal(response.text, "delete successful");

                                done();
                            });
                    });
            });

            test('Test DELETE /api/books/[id] with  id not in db', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .delete(`/api/books/${new mongoose.Types.ObjectId()}`)
                    .end(function (err, response) {
                        assert.equal(response.status, 200);
                        assert.equal(response.text, "no book exists")

                        done();
                    });
            });

        });

    });

});