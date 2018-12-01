//const SERVER_URL = 'http://192.168.86.84:8080/';
const SERVER_URL = 'http://localhost:8080/';

const ASK_STATE_URL = 'getAskState';
const SUBMIT_QUESTION_URL = 'submitQuestion';
const ANSWER_URL = 'getAnswer';

// just for testing
const TEST_MODE = true;

function setAskState(state) {
    testAskState = state
}

const TEST_ANSWER = "This is the answer to your question - Jordan";

const TEST_KEY = "1234567890";
// end of testing section

async function getAnswer(key) {
    // TODO use key
    if (!TEST_MODE) {
        let result = await fetch(SERVER_URL + ANSWER_URL);
        return await result.text();
    } else {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(TEST_ANSWER);
            }, 2000);
        });
    }
}

async function sendQuestionRequest(submission) {
    if (!TEST_MODE) {
        let key = await fetch(SERVER_URL + SUBMIT_QUESTION_URL,
            { method: "POST", question: submission });
        return await key.text();
    } else {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(TEST_KEY);
            }, 1000);
        });
    }
}
