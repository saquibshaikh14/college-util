import React, { useState, useEffect } from 'react';
import { Nav} from 'react-bootstrap';
import download from 'downloadjs';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const UserFilesList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  // const [status, setStatus] = useState(true);

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/getAllFiles`);
        setErrorMsg('');
        setFilesList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getFilesList();
  },[filesList]);

// const deleteFile = async (id, path) => {
//   try {
//     const result = await axios.delete(`${API_URL}/delete/${id}`);
//     setErrorMsg('');
//     return delete(result.data, path);
//   } catch (error) {
//     if (error.response && error.response.status === 400) {
//       setErrorMsg('Error while deleting file. Try again later');
//     }
//   }
// };
const deleteFile = async (id,path) =>{
  //console.log(typeof id)
  let url=`${API_URL}/delete/${id}`;
  await axios.delete(url)
  .then(res=>{
    setFilesList(filesList.filter(file => id !== file.id))
    setErrorMsg('');
  })
};

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  return (
    <>
       <div>
          <div className="header">
            <h1>File Upload And Download</h1>
            <Nav variant="pills" defaultActiveKey="/user/dashboard">
              <Nav.Item>
                <Nav.Link href="/user/dashboard" exact>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/user/dashboard/upload">
                   Upload Files
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
      <div className="files-container">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <table className="files-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filesList.length > 0 ? (
              filesList.map(
                ({ _id, title, description, file_path, file_mimetype }) => (
                
                  <tr key={_id}>
                    <td className="file-title">{title}</td>
                    <td className="file-description">{description}</td>
                    <td>
                      <button
                        onClick={() =>
                          downloadFile(_id, file_path, file_mimetype)
                        }
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          deleteFile(_id, file_path)
                        }
                      > 
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={3} style={{ fontWeight: '300' }}>
                  No files found. Please add some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserFilesList;
