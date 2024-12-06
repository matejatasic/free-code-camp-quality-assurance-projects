const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require("./british-only.js")
const britishToAmericanSpelling = require("./british-to-american-spelling.js");
const britishToAmericanTitles = require("./british-to-american-titles.js");

class Translator {
    static AMERICAN_TO_BRITISH = "american-to-british";
    static BRITISH_TO_AMERICAN = "british-to-american";

    translate(text, locale) {
        const localeToTranslatorMapper = {
            [Translator.AMERICAN_TO_BRITISH]: AmericanToBritishTranslator,
            [Translator.BRITISH_TO_AMERICAN]: BrititshToAmericanTranslator
        };

        const TranslatorClass = localeToTranslatorMapper[locale];
        const translator = new TranslatorClass();
        
        return translator.translate(text);
    }
}

class AmericanToBritishTranslator {
    translate(text) {
        Object.keys(americanOnly).forEach(americanPhrase => {
            const americanPhraseRegexp = new RegExp(`\\b${americanPhrase}\\b`, "gi");
            
            if (americanPhraseRegexp.test(text)) {
                text = text.replace(americanPhraseRegexp, `<span class="highlight">${americanOnly[americanPhrase]}</span>`);
            }
        });

        Object.keys(americanToBritishSpelling).forEach(americanWord => {
            const americanWordRegexp = new RegExp(`\\b${americanWord}\\b`, "gi");
            
            if (americanWordRegexp.test(text)) {
                text = text.replace(americanWordRegexp, `<span class="highlight">${americanToBritishSpelling[americanWord]}</span>`);
            }
        });

        Object.keys(americanToBritishTitles).forEach(americanTitle => {
            const americanTitleRegexp = new RegExp(`(${americanTitle})`, "gi");
            
            if (americanTitleRegexp.test(text)) {
                const title = text.match(americanTitleRegexp)[0].replace(".", "");
                text = text.replace(americanTitleRegexp, `<span class="highlight">${title}</span>`);
            }
        });

        const timeRegexp = /\d+:\d+/g;
        text = text.replace(timeRegexp, match => {
            const transformed = match.replace(":", ".");
            return `<span class="highlight">${transformed}</span>`;
        });

        return text;
    }

    hasPunctuation(word) {
        const lastCharacter = word[word.length - 1];
        const punctuationRegexp = /[.,!?-]/g;

        return punctuationRegexp.test(lastCharacter);
    }
}

class BrititshToAmericanTranslator {
    translate(text) {
        Object.keys(britishOnly).forEach(britishPhrase => {
            const britishPhraseRegexp = new RegExp(`(\\b<span class="highlight">)?\\b${britishPhrase}\\b(</span>)?`, "gi");

            if (britishPhraseRegexp.test(text)) {
                const wordWithSpanRegexp = new RegExp(`<span class="highlight">.*${britishOnly[britishPhrase]}.*<\/span>`);

                if (!wordWithSpanRegexp.test(text)) {
                    text = text.replace(britishPhraseRegexp, `<span class="highlight">${britishOnly[britishPhrase]}</span>`);
                }
            }
        });
        
        Object.keys(britishToAmericanSpelling).forEach(britishWord => {
            const britishWordRegexp = new RegExp(`\\b${britishWord}\\b`, "gi");
            
            if (britishWordRegexp.test(text)) {
                text = text.replace(britishWordRegexp, `<span class="highlight">${britishToAmericanSpelling[britishWord]}</span>`);
            }
        });

        Object.keys(britishToAmericanTitles).forEach(britishTitle => {
            const britishTitleRegexp = new RegExp(`\\b${britishTitle}\\b`, "gi");
            text = text.replace(britishTitleRegexp, match => {
                const transformed = `${match}.`;

                return `<span class="highlight">${transformed}</span>`;
            });
        });

        const timeRegexp = /\d+\.\d+/g;
        text = text.replace(timeRegexp, match => {
            const transformed = match.replace(".", ":");
            
            return `<span class="highlight">${transformed}</span>`;
        });
        
        return text;
    }
}

module.exports = Translator;