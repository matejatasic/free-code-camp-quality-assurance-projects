'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

    const translator = new Translator();

    app.route('/api/translate')
        .post((request, response) => {
            const { text, locale } = request.body;
    
            if (text === undefined || locale === undefined) {
                return response.json({ error: "Required field(s) missing" });
            }

            if (text.trim() === "") {
                return response.json({ error: "No text to translate" });
            }

            if (![Translator.AMERICAN_TO_BRITISH, Translator.BRITISH_TO_AMERICAN].includes(locale)) {
                return response.json({ error: "Invalid value for locale field" });
            }

            const translation = translator.translate(text, locale);

            if (text === translation) {
                return response.json({ text, translation: "Everything looks good to me!" });
            }

            response.json({ text, translation });
        });
};