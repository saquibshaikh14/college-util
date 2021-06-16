import React, { useState, useEffect } from 'react';
import {Modal,Button,ListGroup,Card} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import download from 'downloadjs';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import AdminLoader from './AdminLoader'



const UserFilesList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalInfo, setModalInfo] = useState([]);
  const [show, setShow] = useState(false);
  const [showLoader, toggleLoader] = useState(true)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getFilesList = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getAllFiles`,{withCredentials: true});
      setErrorMsg('');
      setFilesList(data);
      toggleLoader(false)
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
      toggleLoader(false)
    }
  };


//   const getFilesList = async () =>{
//     await axios.get(`${API_URL}/getAllFiles`,{withCredentials: true})
//     .then(res=>{
//         if(res.status === 200){
//             setFilesList(res.data);
//             setErrorMsg('');
//             toggleLoader(false)
//         }else{
//             throw Error('Error fetching data');
//         }
//     })
//     .catch(err=>{
//         console.log(err);
//         setErrorMsg(err.message);
//         toggleLoader(false);
//     })
// }

  useEffect(() => {
    getFilesList();
  },[]);

const deleteFile = (id) =>{
  //console.log(typeof id)
  let url=`${API_URL}/delete/${id}`;
  axios.delete(url,{withCredentials: true})
  .then(res=>{
    //console.log(res)
    //console.log(filesList)
    const newData=filesList.filter(file => id !== file._id)
    //console.log(newData)
    setFilesList(newData);
    //console.log(filesList);
    setErrorMsg('');
    handleClose(true);
  })
};

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`,{withCredentials: true}, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      // console.log(result.data);
      // console.log(mimetype);
      // console.log(filename);
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

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

  
  if(showLoader)
  return (
      <AdminLoader />
  )

  const { SearchBar } = Search;
  const columns = [{
    dataField: 'title',
    text: 'Title',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '25%'};
    },
  }, {
    dataField: 'description',
    text: 'Description',
    headerStyle: (column, colIndex) => {
      return { width: '35%'};
    }
  }, {
    dataField: 'Date',
    text: 'Date Created',
    searchable: false,
    formatter: (cellContent, row) => {
      return (
        <>
        {dateFormat(new Date(`${row.createdAt}`))}
      </>
      );
    },
    headerStyle: (colum, colIndex) => {
      return { width: '20%'};
    }
  },{
    dataField: 'button',
    text: 'Action',
    searchable: false,
    formatter: (cellContent, row) => {
      console.log(row);
      return (
        <>
        <Button style={{margin: "5px"}} variant="primary" onClick={()=>downloadFile(row._id, row.file_path, row.file_mimetype)}>        
        <i className="download icon"></i>
        </Button>
        
        <Button variant="danger" onClick={() => handleShow()}>
        <i className="options icon"></i>
      </Button>
      </>
      );
    },
    headerStyle: (colum, colIndex) => {
      return { width: '20%'};
    } 
  },
]

const rowEvents = {
  onClick: (e, row, rowIndex) => {
    // console.log(row)
    setModalInfo(row);
   
  }
};

function dateFormat(date) {
  const month = date.getMonth();
  const day = date.getDate();
  const monthString = month >= 10 ? month : `0${month+1}`;
  const dayString = day >= 10 ? day : `0${day}`;
  return `${dayString}-${monthString}-${date.getFullYear()}`;
}

const ModalContent =()=>{
  return(
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        
      centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalInfo.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><b>Description:</b> {modalInfo.description}</ListGroup.Item>
          <ListGroup.Item><b>Uploaded By</b> {modalInfo.uploadedBy} under {modalInfo.uploadedUnder}</ListGroup.Item>
          <ListGroup.Item><b>Uploaded on</b> {dateFormat(new Date(`${modalInfo.createdAt}`))}</ListGroup.Item>
          <ListGroup.Item><b>File Type:</b> {modalInfo.file_mimetype}</ListGroup.Item>
        </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteFile(modalInfo._id, modalInfo.file_path)}>
            Delete
          </Button>
          {/* <Button variant="danger" onClick={() => downloadFile(modalInfo._id, modalInfo.file_path,modalInfo.file_mimetype)}>
            Download
          </Button> */}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>  
        </Modal.Footer>
      </Modal>
  )
}

  return (
    <>
      <CaptionContent/>
      {/* Header ends */}
      <div className="files-container">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ToolkitProvider
          keyField='_id' 
          data={ filesList } 
          columns={ columns }      
          search
        >
          {
            props => (
              <>
                <SearchBar style={{margin:'3px'}} { ...props.searchProps } />
                <hr />
                <BootstrapTable
                  { ...props.baseProps }
                  bordered={false}
                  pagination={ paginationFactory() }
                  rowEvents = {rowEvents}
                  noDataIndication={"No files found. Please add some."}
                />
              </>
            )
          }
        </ToolkitProvider>
        {show ? <ModalContent/>:null}
      </div>
      
    </>
  );
};

export default UserFilesList;



// <>
//       <CaptionContent/>
//       {/* Header ends */}
//       <div className="files-container">
//         {errorMsg && <p className="errorMsg">{errorMsg}</p>}
//         <BootstrapTable
//           bordered={false}
//           keyField='_id' 
//           data={ filesList } 
//           columns={ columns }
//           pagination={ paginationFactory() }
//           rowEvents = {rowEvents}
//           noDataIndication={"No files found. Please add some."}
//         />
//         {show ? <ModalContent/>:null}

        

//       </div>
      
//     </>









// <div className="files-container">
// {errorMsg && <p className="errorMsg">{errorMsg}</p>}
// {show ? <ModalContent/>:null}
// <table className="files-table">
//   <thead>
//     <tr>
//       <th>Title</th>
//       <th>Description</th>
//       <th>Download</th>
//       <th>Delete</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filesList.length > 0 ? (
//       filesList.map(
//         ({ _id, title, description, file_path, file_mimetype }) => (
        
//           <tr key={_id} onClick={handleShow} >
//             <td className="file-title">{title}</td>
//             <td className="file-description">{description}</td>
//             <td>
//               <button
//                 onClick={() =>
//                   downloadFile(_id, file_path, file_mimetype)
//                 }
//               >
//                 Download
//               </button>
//             </td>
//             <td>
//               <button
//                 onClick={() =>
//                   deleteFile(_id, file_path)
//                 }
//               > 
//                 Delete
//               </button>
//             </td>
//           </tr>
//         )
//       )
//     ) : (
//       <tr>
//         <td colSpan={3} style={{ fontWeight: '300' }}>
//           No files found. Please add some.
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table>
// </div>