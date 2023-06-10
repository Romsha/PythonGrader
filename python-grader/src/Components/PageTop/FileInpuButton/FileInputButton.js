import { limitFileName } from '../../../utils';
import './FileInputButton.css';

export default function FileInputButton(props) {
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        props.fileHandler(selectedFile);
    };

    return (
        <>
        <input id="fileInput" className="button" type="file" onChange={handleFileChange} />
        <label htmlFor="fileInput" className="buttonLabel">
            {limitFileName(props.fileName, 20)}
        </label>
        </>
    );
}
