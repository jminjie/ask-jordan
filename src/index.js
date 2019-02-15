import React from 'react';
import ReactDOM from 'react-dom';

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LinearProgress from '@material-ui/core/LinearProgress';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import * as server from './server_utils';

const e = React.createElement;

const NO_ANSWER_YET = '';

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
        if (this.askState === '2') {
            // Old poll can be ignored
            return;
        }
        let answer = await server.getAnswer(key);
        if (answer !== NO_ANSWER_YET) {
            this.doneWaiting();
            this.setState({
                askState: '2',
                answer: answer,
            });
        }
    }

    render() {
        if (this.state.askState === '0') {
            return e('div', {style: {textAlign: 'center'}},
                e(About),
                e(Logo),
                e(Submit, {afterSubmit: this.startWaiting})
            );
        } else if (this.state.askState === '1') {
            return e('div', {style: {textAlign: 'center'}},
                e(About),
                e(Logo),
                e(Submit, {
                    afterSubmit: this.startWaiting,
                    value: this.state.question,
                }),
                e(LinearProgress)
            );
        } else if (this.state.askState === '2') {
            return e('div', null,
                e('div', {style: {textAlign: 'center'}},
                    e(About),
                    e(Logo),
                    e(Submit, {
                        value: this.state.question,
                        disableButton: true,
                        disableText: true,
                    }),
                ),
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
            margin: '20vh 0 0 0',
            height: '8em',
        }});
    }
}

class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableButton: this.props.disableButton,
            disableText: this.props.disableText,
        };
        this.label = 'Jordan Search';
        this.onSubmitBoxSubmit = this.onSubmitBoxSubmit.bind(this);
    }

    handleChange(event) {
        this.value = event.target.value;
    }

    async onSubmitBoxSubmit() {
        let key = await server.sendQuestionRequest(this.value);
        this.props.afterSubmit(this.value, key);
    }

    render() {
        return e('form', {
            onSubmit: (e) => {
                e.preventDefault();
                if (this.value === '') return;
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
                onChange: (event) => {this.handleChange(event)},
            }),
            e('br'),
            e(Button, {
                type: 'submit',
                size: 'medium',
                variant: 'contained',
                disabled: this.state.disableButton,
                style: {margin: '40px 10px 20px 10px'},
            }, this.label),
            e(Button, {
                type: 'submit',
                size: 'medium',
                variant: 'contained',
                disabled: this.state.disableButton,
                style: {margin: '40px 10px 20px 10px'},
            }, "I'm feeling lucky"),
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

class About extends React.Component {
    render() {
        return e('div', {style: {
            maxWidth: '3px',
        }},
            e(ExpansionPanel, {
                elevation: 0,
                style: {
                    position: 'absolute',
                    left: '1em',
                    top: '2em',
                }
            },
                e(ExpansionPanelSummary, null,
                    e(Typography, {variant: 'h6', align: 'center'}, 'About')),
                e(ExpansionPanelDetails, null,
                    e(Typography, {variant: 'body2', align: 'left'}, 'Jordan Search (TM)',
                        e('br'), 'works by sending a',
                        e('br'), 'text to Jordan and',
                        e('br'), 'waiting for a reply.')
                )
            )
        );
    }
}

ReactDOM.render(<AskJordan />, document.getElementById('root'));
