const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
    suite("American to British English translation", () => {
        test("should correctly translate 'Mangoes are my favorite fruit.' to British English", () => {
            assert.equal(
                translator.translate("Mangoes are my favorite fruit.", Translator.AMERICAN_TO_BRITISH),
                `Mangoes are my <span class="highlight">favourite</span> fruit.`
            );
        });
    
        test("should correctly translate 'I ate yogurt for breakfast.' to British English", () => {
            assert.equal(
                translator.translate("I ate yogurt for breakfast.", Translator.AMERICAN_TO_BRITISH),
                `I ate <span class="highlight">yoghurt</span> for breakfast.`
            );
        });
    
        test("should correctly translate 'We had a party at my friend's condo.' to British English", () => {
            assert.equal(
                translator.translate("We had a party at my friend's condo.", Translator.AMERICAN_TO_BRITISH),
                `We had a party at my friend's <span class="highlight">flat</span>.`
            );
        });
    
        test("should correctly translate 'Can you toss this in the trashcan for me?' to British English", () => {
            assert.equal(
                translator.translate("Can you toss this in the trashcan for me?", Translator.AMERICAN_TO_BRITISH),
                `Can you toss this in the <span class="highlight">bin</span> for me?`
            );
        });
    
        test("should correctly translate 'The parking lot was full.' to British English", () => {
            assert.equal(
                translator.translate("The parking lot was full.", Translator.AMERICAN_TO_BRITISH),
                `The <span class="highlight">car park</span> was full.`
            );
        });

        test("should correctly translate 'Like a high tech Rube Goldberg machine.' to British English", () => {
            assert.equal(
                translator.translate("Like a high tech Rube Goldberg machine.", Translator.AMERICAN_TO_BRITISH),
                `Like a high tech <span class="highlight">Heath Robinson device</span>.`
            );
        });

        test("should correctly translate 'To play hooky means to skip class or work.' to British English", () => {
            assert.equal(
                translator.translate("To play hooky means to skip class or work.", Translator.AMERICAN_TO_BRITISH),
                `To <span class="highlight">bunk off</span> means to skip class or work.`
            );
        });

        test("should correctly translate 'To play hooky means to skip class or work.' to British English", () => {
            assert.equal(
                translator.translate("To play hooky means to skip class or work.", Translator.AMERICAN_TO_BRITISH),
                `To <span class="highlight">bunk off</span> means to skip class or work.`
            );
        });

        test("should correctly translate 'No Mr. Bond, I expect you to die.' to British English", () => {
            assert.equal(
                translator.translate("No Mr. Bond, I expect you to die.", Translator.AMERICAN_TO_BRITISH),
                `No <span class="highlight">Mr</span> Bond, I expect you to die.`
            );
        });

        test("should correctly translate 'Dr. Grosh will see you now.' to British English", () => {
            assert.equal(
                translator.translate("Dr. Grosh will see you now.", Translator.AMERICAN_TO_BRITISH),
                `<span class="highlight">Dr</span> Grosh will see you now.`
            );
        });

        test("should correctly translate 'Lunch is at 12:15 today.' to British English", () => {
            assert.equal(
                translator.translate("Lunch is at 12:15 today.", Translator.AMERICAN_TO_BRITISH),
                `Lunch is at <span class="highlight">12.15</span> today.`
            );
        });
    });

    suite("British to American English translation", () => {
        test("should correctly translate 'We watched the footie match for a while.' to American English", () => {
            assert.equal(
                translator.translate("We watched the footie match for a while.", Translator.BRITISH_TO_AMERICAN),
                `We watched the <span class="highlight">soccer</span> match for a while.`
            );
        });

        test("should correctly translate 'Paracetamol takes up to an hour to work.' to American English", () => {
            assert.equal(
                translator.translate("Paracetamol takes up to an hour to work.", Translator.BRITISH_TO_AMERICAN),
                `<span class="highlight">Tylenol</span> takes up to an hour to work.`
            );
        });

        test("should correctly translate 'First, caramelise the onions.' to American English", () => {
            assert.equal(
                translator.translate("First, caramelise the onions.", Translator.BRITISH_TO_AMERICAN),
                `First, <span class="highlight">caramelize</span> the onions.`
            );
        });

        test("should correctly translate 'I spent the bank holiday at the funfair.' to American English", () => {
            assert.equal(
                translator.translate("I spent the bank holiday at the funfair.", Translator.BRITISH_TO_AMERICAN),
                `I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.`
            );
        });

        test("should correctly translate 'I had a bicky then went to the chippy.' to American English", () => {
            assert.equal(
                translator.translate("I had a bicky then went to the chippy.", Translator.BRITISH_TO_AMERICAN),
                `I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.`
            );
        });

        test("should correctly translate 'I've just got bits and bobs in my bum bag.' to American English", () => {
            assert.equal(
                translator.translate("I've just got bits and bobs in my bum bag.", Translator.BRITISH_TO_AMERICAN),
                `I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.`
            );
        });

        test("should correctly translate 'The car boot sale at Boxted Airfield was called off.' to American English", () => {
            assert.equal(
                translator.translate("The car boot sale at Boxted Airfield was called off.", Translator.BRITISH_TO_AMERICAN),
                `The <span class="highlight">swap meet</span> at Boxted Airfield was called off.`
            );
        });

        test("should correctly translate 'Have you met Mrs Kalyani?' to American English", () => {
            assert.equal(
                translator.translate("Have you met Mrs Kalyani?", Translator.BRITISH_TO_AMERICAN),
                `Have you met <span class="highlight">Mrs.</span> Kalyani?`
            );
        });

        test("should correctly translate 'Prof Joyner of King's College, London.' to American English", () => {
            assert.equal(
                translator.translate("Prof Joyner of King's College, London.", Translator.BRITISH_TO_AMERICAN),
                `<span class="highlight">Prof.</span> Joyner of King's College, London.`
            );
        });

        test("should correctly translate 'Tea time is usually around 4 or 4.30.' to American English", () => {
            assert.equal(
                translator.translate("Tea time is usually around 4 or 4.30.", Translator.BRITISH_TO_AMERICAN),
                `Tea time is usually around 4 or <span class="highlight">4:30</span>.`
            );
        });
    });

    suite("translation", () => {
        test("should highlight translation in text 'Mangoes are my favorite fruit.'", () => {
            assert.include(
                translator.translate("Mangoes are my favorite fruit.", Translator.AMERICAN_TO_BRITISH),
                "<span class=\"highlight\">favourite</span>"
            )
        });

        test("should highlight translation in text 'I ate yogurt for breakfast.'", () => {
            assert.include(
                translator.translate("I ate yogurt for breakfast.", Translator.AMERICAN_TO_BRITISH),
                "<span class=\"highlight\">yoghurt</span>"
            )
        });

        test("should highlight translation in text 'We watched the footie match for a while.'", () => {
            assert.include(
                translator.translate("We watched the footie match for a while.", Translator.BRITISH_TO_AMERICAN),
                "<span class=\"highlight\">soccer</span>"
            )
        });

        test("should highlight translation in text 'Paracetamol takes up to an hour to work.'", () => {
            assert.include(
                translator.translate("Paracetamol takes up to an hour to work.", Translator.BRITISH_TO_AMERICAN),
                "<span class=\"highlight\">Tylenol</span>"
            )
        });
    })
});