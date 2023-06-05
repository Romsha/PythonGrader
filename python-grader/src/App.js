import './App.css';
import PageTop from './Components/PageTop/PageTop';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import ResultStats from './Components/ResultStats/ResultStats';

function App() {
  const [resData, setResData] = useState(null);

  const sendRequest = (fileName, fileContent) => {
    setResData(null);
    const postData = { name: fileName, content: fileContent };
    fetch('http://localhost:12345/parseFile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
      // TODO: handle success=False
      setResData(data);
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="App">
      <PageTop 
        sendRequest={sendRequest}
        toast={toast}/>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        progressStyle={{background: "#ED6A5A"}}
      />
      {resData ? <ResultStats data={resData}/> : ''}
    </div>
  );
}

export default App;
