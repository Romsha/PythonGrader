import './PageTop.css'
import FileInputButton from './FileInpuButton/FileInputButton';
import TrashOpened from '../../assets/TrashFull.png';
import TrashClosed from '../../assets/TrashEmpty.png';
import ParamsText from './ParamsText/ParamsText';

import {useState} from 'react';


export default function PageTop(props) {
    const [fileName, setFileName] = useState(null);
    const [draging, setDraging] = useState(false);
    const [dragingTrash, setDragingTrash] = useState(false);

    const fileHandler = (fileObj) => {
        if (fileObj.name.endsWith('.zip') || fileObj.name.endsWith('.py')) {
          setFileName(fileObj.name);
          props.sendRequest(fileObj);
        } else {
          props.toast("We only support .py and .zip files");
        }
      }
    
      const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
      }
    
      const handleDrop = (event) => {
        event.preventDefault();
        if (dragingTrash) {
          setDragingTrash(false);
        } else {
          const files = event.dataTransfer.files;
          fileHandler(files[0]);
        }
        setDraging(false);
      };
    
      const handleDragEnter = (event) => {
        event.preventDefault();
        setDraging(true);
      };
    
      const handleDragEnterTrash = (event) => {
        event.preventDefault();
        setDragingTrash(true)
      }
    
      const handleDragLeave = (event) => {
        event.preventDefault();
        if (dragingTrash) {
          setDragingTrash(false);
        } else {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDraging(false);
          }
        }
      };

    return (
        <>
        <div 
        className="pageTop"
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}>
        <div className="headline">
          <h1 className="headline">Python Code Grader</h1>
          <h2 className="headline">Find out how pretty is your code</h2>
        </div>
        <div className="dropContainer">
          <div className="dropText">Drop your file anywhere on this area</div>
          <div className="dropOr">OR</div>
          <FileInputButton 
            fileHandler={fileHandler}
            fileName={fileName ? fileName : "Choose File"}
            />
        </div>
        <ParamsText />
      </div>
      {draging ? <div 
        className="dragView"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}>
          Drop anywhere
          <img 
            className="trash"
            src={dragingTrash ? TrashOpened : TrashClosed} 
            alt="trash"
            onDrop={handleDrop}
            onDragEnter={handleDragEnterTrash}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}/>
        </div> : ''}
        </>
    );
}