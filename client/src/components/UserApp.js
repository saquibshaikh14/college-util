import React, { useState, useRef, useContext } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Form, Row, Col, Button} from 'react-bootstrap';
import { API_URL } from '../utils/constants';
import './stylesheet/UserApp.css';
import History from '../utils/history';
import { AuthContext } from '../context/AuthContext';

const App = (props) => {
  const { user} = useContext(AuthContext);

  const [file, setFile] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(''); // state for storing previewImage
  const [state, setState] = useState({
    title: '',
    description: '',
    uploadedUnder: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const CaptionContent=()=>{
    return(
      <h3 style={{
        textAlign: 'center',
        color: 'blue',
        padding: '0.5em' 
      }}>
       File Upload and Download 
      </h3>
    )
  } 

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    dropRef.current.style.border = '2px dashed #e9ebeb';
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      //console.log(state);
      
      const { title, description,uploadedUnder } = state;
      if (title.trim() !== '' && description.trim() !== '' && uploadedUnder !=='') {
        if (file) {
          const formData = new FormData();
          //console.log(formData)
          formData.append('file', file);
          formData.append('title', title);
          formData.append('description', description);
          formData.append('uploadedUnder', uploadedUnder);

          setErrorMsg('');
          await axios.post(`${API_URL}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          History.push('/user/dashboard/show_files');
        } else {
          setErrorMsg('Please select a file to add.');
        }
      } else {
        setErrorMsg('Please enter all the field values.');
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  

  return (
    <>
      <CaptionContent/>
      {/* <div className="header">
            <h1>File Upload And Download</h1>
            <Nav variant="pills" defaultActiveKey="/user/dashboard">
              <Nav.Item>
                <Nav.Link href="/user/dashboard" exact={true}>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/user/dashboard/show_files">
                   Files List
                </Nav.Link>
              </Nav.Item>
            </Nav>
        </div> */}
    {/*............................... Header ends here...................................... */}
    
    
      <Form className="search-form" onSubmit={handleOnSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Row>
          <Col className="titleCol">
            <Form.Group controlId="title">
            <Form.Label><b>Title</b></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={state.title || ''}
                placeholder="Enter title"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="description">
            <Form.Label><b>Description</b></Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={state.description || ''}
                placeholder="Enter description"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="uploadedUnder">
              <Form.Label><b>Select Cell</b></Form.Label>
              <Form.Control as="select"
                type="text" 
                name="uploadedUnder" 
                value={state.uploadedUnder || ''} 
                onChange={handleInputChange}
              >
                <option key = 'blankChoice' hidden value> Select Cell</option>
                {Object.entries(user.role).map(([key, role], i) => (
                    <option key={i}>
                        {role}
                    </option>
                ))}
                
              </Form.Control>            
            </Form.Group>
          </Col>
        </Row>
        <div className="upload-section">
          <Dropzone
            onDrop={onDrop}
            onDragEnter={() => updateBorder('over')}
            onDragLeave={() => updateBorder('leave')}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                <input {...getInputProps()} />
                <p>Drag and drop a file OR click here to select a file</p>
                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          {previewSrc ? (
            isPreviewAvailable ? (
              <div className="image-preview">
                <img className="preview-image" src={previewSrc} alt="Preview" />
              </div>
            ) : (
              <div className="preview-message">
                <p>No preview available for this file</p>
              </div>
            )
          ) : (
            <div className="preview-message">
              <p>Image preview will be shown here after selection</p>
            </div>
          )}
        </div>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default App;
