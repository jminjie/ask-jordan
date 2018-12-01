//const SERVER_URL = 'http://localhost:8080/';
const SERVER_URL = 'http://jminjie.com:5000/';

const SUBMIT_QUESTION_URL = 'askquestion';
const ANSWER_URL = 'getanswer';

// just for testing
const TEST_MODE = false;

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
        console.log("result=" + result);
        let resultJson = await result.json();
        console.log("resultJson=" + resultJson);
        return resultJson['answer'];
    } else {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(TEST_ANSWER);
            }, 2000);
        });
    }
}

async function sendQuestionRequest(submission) {
    console.log("sendQuestionRequest: " + JSON.stringify({"question" : submission}));
    if (!TEST_MODE) {
        let key = await fetch(SERVER_URL + SUBMIT_QUESTION_URL,
            { method: "POST", body: JSON.stringify({"question" : submission})});
        return await key.text();
    } else {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(TEST_KEY);
            }, 1000);
        });
    }
}
