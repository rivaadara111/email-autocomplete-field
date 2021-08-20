import React from 'react';
import emailList from './emailList';
import './css/emailInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class EmailInput extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = { 
            selectedEmails: [],
            suggestedEmails: [],
            curEmailList: emailList,
            curInput: '',
            inputError: false,
            inputWidth: 50
         };

        this.onSelect = this.onSelect.bind(this);
        this.completeSelect = this.completeSelect.bind(this);
        this.onInput = this.onInput.bind(this);
    }

    onInput(e) {

        var curInput = e.target.value;
        var curInputLength = curInput.length;

        if (curInputLength) {

            var suggestedEmails = this.state.curEmailList.filter(list => list.includes(curInput));
            var inputError = false;

            if (suggestedEmails.length === 0) {
                inputError = true;
            }

            this.setState({
                curInput: e.target.value,
                suggestedEmails: suggestedEmails,
                inputError: inputError,
                inputWidth: curInputLength
            });

        } else {
            this.setState({
                curInput: '',
                suggestedEmails: []
            });
        }
    }

    onSelect (e, email) {
        if (e.type === 'click') {
            this.completeSelect(email)
        } else if (e.type === 'keypress') {
            var code = e.charCode || e.keyCode;
            if ((code === 32)|| (code === 13)) {
                this.completeSelect(email)
            }
        }
    }

    completeSelect(email) {

        var selectedEmailIndex = this.state.curEmailList.indexOf(email);
        this.state.curEmailList.splice(selectedEmailIndex, 1);
        var curEmailList = this.state.curEmailList;
        var emails = this.state.selectedEmails;

        emails.push(email);

        this.setState({
            curEmailList: curEmailList,
            selectedEmails: emails,
            curInput: ''
        });
    }

    removeEmail (email) {
        var selectedEmails = this.state.selectedEmails.filter(em => em !== email);
        let emailList = this.state.curEmailList;
        emailList.push(email);

        this.setState({
            curEmailList: emailList,
            selectedEmails: selectedEmails
        });
    }

    calcInputWidth(){
        let width;
        if (this.state.curInput.length > 0 || this.state.selectedEmails.length > 0){
            width = this.state.inputWidth;
        } else {
           width = 50;
        }
        return width;
    }

    render() {

        var {curInput, suggestedEmails, selectedEmails, inputError } = this.state;

        let placeholder = "Enter recipients..."
        let width = this.calcInputWidth();
        let selectedEmailList = null;
        let inputClassNames = "email-list-input";
        
        if (selectedEmails.length > 0) {
            placeholder = "";
            selectedEmailList = selectedEmails.map((email,i) => {
                return <div className="selected-email" key={i}>
                    {email}
                    <FontAwesomeIcon icon={faTimes} onClick={() => this.removeEmail(email)} />
                </div>;
            });
        }
        
        var input = <input className={inputClassNames} style={{width: width + 'ch'}} type="text" onChange={e => this.onInput(e)} value={this.state.curInput} ref={input => input && input.focus()} placeholder={placeholder}/>;
        
        if (inputError) {
            inputClassNames += ' email-list-input-error';
        }

        return <div className="email-list-input-container">
            <div className="selected-email-list">
                {selectedEmailList}
                {inputError ? <div className="email-list-input-error-wrap">
                    {input}
                    <FontAwesomeIcon icon={faExclamationCircle}/>
                </div> : input }
            </div>
            {curInput.length && !inputError ? 
                <ul className="email-list-suggestions">
                    {suggestedEmails.map((email,i) => <li className="email-list-suggestion" key={i} tabIndex={0} onClick={(e) => this.onSelect(e, email)} onKeyPress={(e) => this.onSelect(e, email)}>
                        {email}
                    </li>)}
                </ul>
            : null}
        </div>;
    }
  }