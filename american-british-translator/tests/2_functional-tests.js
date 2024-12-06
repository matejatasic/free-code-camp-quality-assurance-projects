const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
    test("test /translate returns a translation when text and valid locale are provided", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "Mangoes are my favorite fruit.",
                locale: Translator.AMERICAN_TO_BRITISH
            })
            .end(function (err, response) {
                assert.equal(response.status, 200);
                const responseBody = response.body

                assert.isDefined(responseBody.text);
                assert.equal(responseBody.translation, "Mangoes are my <span class=\"highlight\">favourite</span> fruit.")

                done();
            });
    });

    test("test /translate returns an error when invalid locale is provided", (done) => {
        chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({
            text: "Mangoes are my favorite fruit.",
            locale: "serbian"
        })
        .end(function (err, response) {
            assert.equal(response.status, 200);
            const responseBody = response.body

            assert.equal(responseBody.error, "Invalid value for locale field")

            done();
        });
    });

    test("test /translate returns an error when no text is provided", (done) => {
        chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({
            locale: Translator.AMERICAN_TO_BRITISH
        })
        .end(function (err, response) {
            assert.equal(response.status, 200);
            const responseBody = response.body

            assert.equal(responseBody.error, "Required field(s) missing")

            done();
        });
    });

    test("test /translate returns an error when no locale is provided", (done) => {
        chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({
            text: "Mangoes are my favorite fruit.",
        })
        .end(function (err, response) {
            assert.equal(response.status, 200);
            const responseBody = response.body

            assert.equal(responseBody.error, "Required field(s) missing")

            done();
        });
    });

    test("test /translate returns an error when empty text is provided", (done) => {
        chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({
            text: "",
            locale: Translator.AMERICAN_TO_BRITISH
        })
        .end(function (err, response) {
            assert.equal(response.status, 200);
            const responseBody = response.body

            assert.equal(responseBody.error, "No text to translate")

            done();
        });
    });

    test("test /translate returns an appropriate response when there is nothing to translate", (done) => {
        chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .send({
            text: "Mangoes are my favorite fruit.",
            locale: Translator.BRITISH_TO_AMERICAN
        })
        .end(function (err, response) {
            assert.equal(response.status, 200);
            const responseBody = response.body

            assert.equal(responseBody.translation, "Everything looks good to me!")

            done();
        });
    });
});