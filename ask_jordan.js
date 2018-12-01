'use strict';

const e = React.createElement;

class AskJordan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            askState: '0',
            question: 'not set',
            answer: 'not set',
        };
        this.startWaiting = this.startWaiting.bind(this);
    }

    startWaiting(question, key) {
        this.setState({
            askState: '1',
            question: question,
        });
        this.timer = setInterval(()=> this.pollForAnswer(key), 2000);
    }

    doneWaiting() {
        clearInterval(this.timer);
    }

    async pollForAnswer(key) {
        console.log("pollForAnswer key=" + key);
        let answer = await getAnswer(key);
        console.log("pollForAnswer answer=" + answer);
        if (answer != "") {
            console.log("pollForAnswer done waiting");
            this.doneWaiting();
            this.setState({
                askState: '2',
                answer: answer,
            });
        }
    }

    render() {
        console.log('AskJordan is rendered with state=' + this.state.askState);
        if (this.state.askState == '0') {
            return e('div', null, 'Ask a question',
                e(SubmitBox, {afterSubmit: this.startWaiting})
            );
        } else if (this.state.askState == '1') {
            return 'Waiting for Jordan';
        } else if (this.state.askState == '2') {
            return e('div', null, 
                e('ul', null,
                    e('li', null, "Q:" + this.state.question),
                    e('li', null, "A:" + this.state.answer)
                )
            );
        } else {
            return "Ask state is invalid =" + this.state.askState;
        }
    }
}

class SubmitBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            message: '',
        };
        this.label = "Ask Jordan!";
        this.onSubmitBoxSubmit = this.onSubmitBoxSubmit.bind(this);
    }

    handleChange(event) {
        this.state.value = event.target.value;
    }

    async onSubmitBoxSubmit(event) {
        event.preventDefault();
        this.setState({
            message: "Sending question",
        });
        let key = await sendQuestionRequest(this.state.value);
        this.props.afterSubmit(this.state.value, key);
    }

    render() {
        return e(
            'form', {
                onSubmit: () => {this.onSubmitBoxSubmit(event)}
            },
            e('input', {
                onChange: () => {this.handleChange(event)},
                rows: this.rows,
                cols: this.cols,
            }),
            e('br'),
            e('button', {type: 'submit'}, this.label),
            e('div', null, this.state.message)
        );
    }
}

// these lines find the like_button_container div and display the react
// component inside it
const domContainer = document.querySelector('#ask-jordan');
ReactDOM.render(e(AskJordan), domContainer);
