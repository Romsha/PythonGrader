import './FileInputButton.css';

export default function FileInputButton(props) {
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        props.fileHandler(selectedFile);
    };

    const formatFileName = (fileName) => {
        const MAX_SIZE = 20;
        if (fileName.length <= MAX_SIZE) {
            return fileName;
        }
        return fileName.substring(0,MAX_SIZE - 4) + '...';
    }

    return (
        <>
        <input id="fileInput" className="button" type="file" onChange={handleFileChange} />
        <label for="fileInput" className="buttonLabel">
            {formatFileName(props.fileName)}
        </label>
        </>
    );
}
