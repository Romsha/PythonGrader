import './GithubSelector.css';
import { useState, useRef } from 'react';

export default function GithubSelector(props) {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const inputRef = useRef(null);
    
    const validateText = (event) => {
        if (event.target.value[0] === '/') {
            event.target.value = event.target.value.slice(1);
        } else if (event.target.value.includes('.com')) {
            event.target.value = event.target.value.split('.com/')[1];
        }
        if (event.target.value.includes('/') && (inputRef.current.value.split('/')[1] !== '')) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }

    const submit = () => {
        if (btnDisabled) { return };
        const owner = inputRef.current.value.split('/')[0];
        const repo = inputRef.current.value.split('/')[1];
        props.submit(owner, repo);
    }

    return (
        <div className="github">
            <div>Or insert Github link</div>
            <div className="urlContainer">
                <div className="urlDomain">github.com/</div>
                <input 
                    type="text" 
                    className="urlInput" 
                    placeholder="kubernetes-client/python"
                    onChange={validateText}
                    ref={inputRef}></input>
            </div>
            <button 
                className="submitBtn"
                disabled={btnDisabled}
                onClick={submit}>Submit</button>
        </div>
    )
}