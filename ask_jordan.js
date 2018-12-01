'use strict';

const e = React.createElement;

const NO_ANSWER_YET = '';

const {
    Button,
    LinearProgress,
    OutlinedInput,
    Paper,
    Typography,
} = window['material-ui'];

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
        if (this.askState == '2') {
            // Old poll can be ignored
            return;
        }
        let answer = await getAnswer(key);
        if (answer != NO_ANSWER_YET) {
            this.doneWaiting();
            this.setState({
                askState: '2',
                answer: answer,
            });
        }
    }

    render() {
        if (this.state.askState == '0') {
            return e('div', {style: {textAlign: 'center'}},
                e(Logo),
                e(Submit, {afterSubmit: this.startWaiting})
            );
        } else if (this.state.askState == '1') {
            return e('div', {style: {textAlign: 'center'}},
                e(Logo),
                e(Submit, {
                    afterSubmit: this.startWaiting,
                    value: this.state.question,
                }),
                e(LinearProgress)
            );
        } else if (this.state.askState == '2') {
            return e('div', null,
                e('div', {style: {textAlign: 'center'}},
                    e(Logo),
                    e(Submit, {
                        value: this.state.question,
                        disableButton: true,
                        disableText: true,
                    }),
                ),
                e('br'),
                e(Results, {value: this.state.answer})
            );
        } else {
            return 'Ask state is invalid =' + this.state.askState;
        }
    }
}

class Logo extends React.Component {
    render() {
        return e('img', {src: 'resources/jordan.png', style: {
            padding: '20vh 0 0 0',
            height: '8em',
        }});
    }
}

class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            disableButton: this.props.disableButton,
            disableText: this.props.disableText,
        };
        this.label = 'Ask Jordan!';
        this.onSubmitBoxSubmit = this.onSubmitBoxSubmit.bind(this);
    }

    handleChange(event) {
        this.state.value = event.target.value;
    }

    async onSubmitBoxSubmit() {
        let key = await sendQuestionRequest(this.state.value);
        this.props.afterSubmit(this.state.value, key);
    }

    render() {
        return e('form', {
            onSubmit: (e) => {
                e.preventDefault();
                this.onSubmitBoxSubmit();
                this.setState({
                    disableButton: true,
                    disableText: true,
                });
            }
        },
            e(OutlinedInput, {
                placeholder: 'e.g. How far is the moon from the earth?',
                fullWidth: true,
                value: this.props.value,
                labelWidth: 0,
                disabled: this.state.disableText,
                onChange: () => {this.handleChange(event)},
            }),
            e('br'),
            e('br'),
            e(Button, {
                type: 'submit',
                size: 'medium',
                variant: 'contained',
                disabled: this.state.disableButton,
            }, 'Ask Jordan'),
            e('br'),
        );
    }
}

class Results extends React.Component {
    render() {
        return e(Paper, {style: {
            padding: 10,
            textAlign: 'left',
        }},
            e(Typography, {variant: 'h5'}, 'Search results:'),
            e(Typography, {component: 'p'}, this.props.value)
        );
    }
}

// these lines find the like_button_container div and display the react
// component inside it
const domContainer = document.querySelector('#ask-jordan');
ReactDOM.render(e(AskJordan), domContainer);
