const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require("mongoose");
const { Issue } = require("../models.js");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Test POST /api/issues/{project} with every input field", function (done) {
    const body = {
      issue_title: "Fix error in posting data",
      issue_text: "When we post data it has an error.",
      created_by: "Joe",
      assigned_to: "John",
      status_text: "To be fixed"
    }

    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send(body)
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const responseBody = response.body

        assert.equal(body.issue_title, responseBody.issue_title);
        assert.equal(body.issue_text, responseBody.issue_text);
        assert.equal(body.created_by, responseBody.created_by);
        assert.equal(body.assigned_to, responseBody.assigned_to);
        assert.equal(body.status_text, responseBody.status_text);
        assert.isDefined(responseBody._id);
        assert.isDefined(responseBody.created_on);
        assert.isDefined(responseBody.updated_on);
        assert.isDefined(responseBody.open);

        done();
      });
  });

  test("Test POST /api/issues/{project} with only required input fields", function (done) {
    const body = {
      issue_title: "Fix error in getting data",
      issue_text: "When we fetch data with filters it has an error.",
      created_by: "Alaric",
    }

    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send(body)
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const responseBody = response.body

        assert.equal(responseBody.issue_title, body.issue_title);
        assert.equal(responseBody.issue_text, body.issue_text);
        assert.equal(responseBody.created_by, body.created_by);
        assert.equal(responseBody.assigned_to, "");
        assert.equal(responseBody.status_text, "");
        assert.isDefined(responseBody._id);
        assert.isDefined(responseBody.created_on);
        assert.isDefined(responseBody.updated_on);
        assert.isDefined(responseBody.open);

        done();
      });
  });

  test("Test POST /api/issues/{project} without the required input fields", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({})
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const responseBody = response.body

        assert.isDefined(responseBody.error);
        assert.equal(responseBody.error, "required field(s) missing");

        done();
      });
  });

  test("Test GET /api/issues/{project} without filters", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isArray(body);
        assert.isNotEmpty(body);

        done();
      });
  });

  test("Test GET /api/issues/{project} with one filter", function (done) {
    const createdByValue = "Alaric";

    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .query({ created_by: createdByValue })
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isArray(body);
        assert.isNotEmpty(body);
        assert.isTrue(body.every(document => document.created_by === createdByValue))

        done();
      });
  });

  test("Test GET /api/issues/{project} with multiple filter", function (done) {
    const issueTitleValue = "Fix error in getting data";
    const createdByValue = "Alaric";

    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .query({
        issue_title: issueTitleValue,
        created_by: createdByValue
      })
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isArray(body);
        assert.isNotEmpty(body);
        assert.isTrue(body.every(document => document.created_by === createdByValue && document.issue_title === issueTitleValue));

        done();
      });
  });

  test("Test PUT /api/issues/{project} with one field", function (done) {
    Issue.findOne({
      created_by: "Alaric"
    })
      .then(document => {
        const issueTitleValue = "Updated title";

        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/apitest")
          .send({
            _id: document._id,
            issue_title: issueTitleValue
          })
          .end(function (err, response) {
            assert.equal(response.status, 200);
            const body = response.body

            assert.isDefined(body.result);
            assert.equal(body.result, "successfully updated");
            assert.equal(body._id, document._id);

            Issue.findById(document._id)
              .then(updatedDocument => {
                assert.equal(updatedDocument.issue_title, issueTitleValue);
              })

            done();
          });
      });
  });

  test("Test PUT /api/issues/{project} with multiple fields", function (done) {
    Issue.findOne({
      created_by: "Alaric"
    })
      .then(document => {
        const issueTitleValue = "Updated title";
        const issueTextValue = "Updated text";
        const createdByValue = "Richard";

        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/apitest")
          .send({
            _id: document._id,
            issue_title: issueTitleValue,
            issue_text: issueTextValue,
            created_by: createdByValue
          })
          .end(function (err, response) {
            assert.equal(response.status, 200);
            const body = response.body

            assert.isDefined(body.result);
            assert.equal(body.result, "successfully updated");
            assert.equal(body._id, document._id);

            Issue.findById(document._id)
              .then(updatedDocument => {
                assert.equal(updatedDocument.issue_title, issueTitleValue);
                assert.equal(updatedDocument.issue_title, issueTextValue);
                assert.equal(updatedDocument.issue_title, createdByValue);
              })

            done();
          });
      });
  });

  test("Test PUT /api/issues/{project} with no _id field", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({})
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isDefined(body.error);
        assert.equal(body.error, "missing _id");

        done();
      });
  });

  test("Test PUT /api/issues/{project} with no fields to update", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: mongoose.Types.ObjectId()
      })
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isDefined(body.error);
        assert.isDefined(body._id);
        assert.equal(body.error, "no update field(s) sent");

        done();
      });
  });

  test("Test PUT /api/issues/{project} with an invalid _id", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: mongoose.Types.ObjectId(),
        created_by: "Stephen"
      })
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isDefined(body.error);
        assert.isDefined(body._id);
        assert.equal(body.error, "could not update");

        done();
      });
  });

  test("Test DELETE /api/issues/{project}", function (done) {
    Issue.findOne({
      created_by: "Joe"
    }).
      then(document => {
        chai
          .request(server)
          .keepOpen()
          .delete("/api/issues/apitest")
          .send({
            _id: document._id
          })
          .end(function (err, response) {
            assert.equal(response.status, 200);
            const body = response.body

            assert.isDefined(body.result);
            assert.isDefined(body._id);
            assert.equal(body.result, "successfully deleted");

            Issue.findById(document._id)
              .then(document => {
                assert.isUndefined(document);
              })

            done();
          });
      });
  });

  test("Test DELETE /api/issues/{project} with invalid _id", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({
        _id: mongoose.Types.ObjectId()
      })
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isDefined(body.error);
        assert.isDefined(body._id);
        assert.equal(body.error, "could not delete");

        done();
      });
  });

  test("Test DELETE /api/issues/{project} with no _id", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({})
      .end(function (err, response) {
        assert.equal(response.status, 200);
        const body = response.body

        assert.isDefined(body.error);
        assert.equal(body.error, "missing _id");

        done();
      });
  });
});