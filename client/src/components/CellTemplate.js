import axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useEffect, useState } from 'react';
import { Card, Table , Icon, Grid, Popup, Form} from 'semantic-ui-react';


import AdminLoader from './AdminLoader';

export default function CellTemplate({activeCell}) {

    const [fileList, setFileList]= useState([]);
    const [activeComponent, setActiveComponent] = useState(activeCell);
    //setActiveComponent(activeComponent)
    
    const [error, setError] = useState(false);
    const [showLoader, toggleLoader] = useState(true);
    const [disabledButton, setDisabledButton] = useState(false);
    const [showModal, setModalView] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        uploadImage: '',
        cell: activeComponent.trim()
    });

    const [previewAvailable, setPreviewAvailable] = useState(false);


    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    function pad(n) {
        return n < 10 ? "0"+n : n;
    }

    function getDate(date){

        let dateObject = new Date(date);
        return pad(dateObject.getDate())+" "+ month[dateObject.getMonth()] +" "+dateObject.getFullYear();
    }

    const getFileList = async (activeComponent, componentStatus) =>{
        try{
             
            const {data} = await axios.get('http://localhost:5000/files/getfiles/'+activeComponent, {withCredentials: true});

            if(!componentStatus.isMounted)
                return;

            if(data.response_status === 1000){
                setFileList(data.response_data);
                toggleLoader(false)
                console.log(data.response_data)
            }
            else if(data.response_status === 1001 || data.response_status === 1002){
                throw Error(data.message);
            }else {
                console.log(data);
                throw Error('Error, check console for more');
            }

        }catch(e){
            console.log(e);
            setError(e.message)
        }
    }

    const deleteFile = (fileId) => {
        setDisabledButton(true);
        axios.post('http://localhost:5000/files/deletefile',{
            id: fileId
        }, {withCredentials: true})
        .then(res=>{
            if(res.status === 200){
                return res.data;
            }else{
                setDisabledButton(false);
                alert('Error getting data');
            }
            console.log(res);
            return false;
        })
        .then(result=>{
            console.log(result);
            if(!result)
                return;
            if(result.response_status === 1000){
                setDisabledButton(false);
                //update existing user list
                let updatedFileList = fileList.filter((file)=>file._id !== fileId)
                
                setFileList(updatedFileList);
            }
            else if(result.response_status === 1001 || result.response_status === 1002){
                alert(result.message);
            }else {
                console.log(result);
                alert('ERROR: CHECK CONSOLE FOR DETAILS');
            }
            setDisabledButton(false);
        })
        .catch(err=>{setDisabledButton(false); console.log(err); alert(err.message)})
    }

    const downloadFile = (fileId, title, path) =>{
        axios.post('http://localhost:5000/files/downloadfile',{id: fileId}, {responseType: 'blob', withCredentials: true})
        .then(res=>{
            
            if(res.status === 200){
                console.log(res, res.data, res.headers['content-type'], res.data.type);
                //console.log(JSON.parse(res.data))
                if(res.data.type.match(/json/gi))
                {
                    // console.log(res.data.text())
                    return new Promise((resolve, reject)=>{
                        res.data.text()
                        .then(text=>resolve(JSON.parse(text)))
                        .catch(err=>reject({response_status: 1002, message: 'Error converting to text data'}));
                    });
                }
                 else   
                    return res.data;
            }else{
               // setDisabledButton(false);
               console.log(res.status)
                alert('Error getting data');
                return false;
            };
        })
        .then(result=>{
            
            if(!result)
                return;
            
            // if(result.response_status === 1000){
            //     //setDisabledButton(false);
            //     //update existing user list
            //     fileDownload(result.response_data, result.fileName);
            // }
            if(result.response_status === 1001 || result.response_status === 1002){
               return alert(result.message);
            }
            let pathSplit = path.split('/');
            let fileExtension = pathSplit[pathSplit.length - 1];

            //download(result.response_data, title + fileExtension);
            fileDownload(result, title+fileExtension);
            setDisabledButton(false);
        })
        .catch(err=>{ console.log(err); alert(err.message)})

    }

    const uploadFile =(e) =>{

        e.preventDefault();
      
        setDisabledButton(true);
        const {title, description, uploadImage, cell} = uploadForm;
        if(title.trim() === '' || description.trim() === '' || cell.trim() === '' || uploadImage === ''){
            setDisabledButton(false);
            return alert('All fields are required!');
        }

        const formData = new FormData();
        formData.append('file', uploadImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('uploadedUnder', cell);

        axios.post('http://localhost:5000/files/uploadfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        })
        .then(res=>{
            if(res.status === 200){
                return res.data;
            }else{
                setDisabledButton(false);
                alert('Error fetching data');
            }
            return false;
        })
        .then(result=>{

            console.log(result);
            if(!result)
                return;
            if(result.response_status === 1000){
                alert('File uploaded');
                //setFileList([result.response_data,...fileList])
                setPreviewAvailable(false);
                setUploadForm({
                    title: '',
                    description: '',
                    uploadImage: '',
                    cell: activeComponent.trim()
                })
                setActiveComponent(activeComponent + ' ');
                setModalView(false);
            }
            else if(result.response_status === 1001 || result.response_status === 1002){
                alert(result.message);
            }else {
                console.log(result);
                alert('Error, check console for more');
            }
            setDisabledButton(false);
        })
        .catch(err=>{
            setDisabledButton(false);
            console.log(err);
            alert(err.message);
        })

    }

    const cancelForm= () =>{
        setUploadForm({
            ...uploadForm, ...{title: '',description: '',uploadImage: '',}
        });
        setPreviewAvailable(false);
        setModalView(false);
    }

    const sortFileLists = () => {
        setFileList([...fileList].reverse())
    }

    const handleChange = (e) =>{
      
        if(e.target.type === 'file')
        {
            if(e.target.files.length === 0){
                setUploadForm({...uploadForm, [e.target.name]:  ""});
                setPreviewAvailable(false);
            }
            else{
                setUploadForm({...uploadForm, [e.target.name]:  e.target.files[0]});
                if(e.target.files[0].type.replace(/(.*)\//g, '').match(/(jpeg|jpg|png)$/))
                setPreviewAvailable(true)
                else
                setPreviewAvailable(false);
            }
                
           // console.log(e.target.files[0].type.replace(/(.*)\//g, ''))
            
        }else
            setUploadForm({...uploadForm, [e.target.name]: e.target.value});
    }
    
     useEffect(() => {
        let componentStatus = {
            isMounted: true
        };
        
        //get user data from server.
        getFileList(activeComponent, componentStatus);

        return ()=>{
            componentStatus.isMounted = false;
        };

    }, [activeComponent])


    if(error){
        return (
            <div>
                {error}
            </div>
        )
    }

    if(showLoader)
        return (
            <AdminLoader />
        )
     

    return (
        <div>
           {showModal && (
            <div className="modal-form-container">
                <div className="modal-form">
                    <h3 style={{textAlign: "center", marginTop: "30px", textTransform: "uppercase"}}>Uploading file - {activeComponent}</h3>
                    <div style={{display: "flex", height: 'calc(100% - 80px)', alignItems: "center"}}>
                        <div style={{flex: 1,borderRight: '1px solid #ccc', padding: "10px 30px"}}>
                            <Form>
                                <Form.Field>
                                <label>Title</label>
                                    <input name="title" placeholder='Title' value={uploadForm.title} onChange={handleChange} />
                                </Form.Field>
                                <Form.Field>
                                <label>Description</label>
                                    <textarea name="description" placeholder="Description" value={uploadForm.description} onChange={handleChange}/>
                                </Form.Field>
                                <Form.Field>
                                <label>Selected Cell</label>
                                    <input name="cell" value={activeComponent} readOnly  onChange={handleChange}/>
                                </Form.Field>
                                <Form.Field>
                                <label>Upload File</label>
                                    <input name="uploadImage" type="file" onChange={handleChange} />
                                </Form.Field>
                                <Form.Field style={{textAlign: "center"}}>
                                    <button style={{background: "red", border: 0, padding: "10px 20px", color: "#fff",cursor:"pointer", borderRadius: '12px'}} disabled={disabledButton} onClick={cancelForm}>
                                        Cancel
                                    </button>
                                    &nbsp;
                                    &nbsp;
                                    <button className="upload-file-btn" type="submit" disabled={disabledButton} onClick={uploadFile}>Upload</button>
                                </Form.Field>
                            </Form>
                        </div>
                        <div style={{flex: 1, textAlign: "center"}}>
                            {previewAvailable?<img src={URL.createObjectURL(uploadForm.uploadImage)} alt="File" style={{maxHeight: '500px', maxWidth: '500px'}}/>:"No preview available"}
                            
                        </div>
                    </div>
                </div>
            </div>)
            }

            <Grid columns="three" style={{width: '85%', margin: "0 auto", marginBottom: "20px"}}>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                    <div style={{height: '100%', width: '100%', display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <h3>{activeComponent}</h3>
                    </div>
                </Grid.Column>
                <Grid.Column style={{textAlign: "right", paddingRight: 0}}>
                    <button className="upload-file-btn" onClick={()=>{setModalView(true)}}>Upload File</button>
                </Grid.Column>
            </Grid>
            {/* file lists */}
            <Card className="user-list-card" style={{width: "85%"}}>
                <Card.Content>

                    <Card.Header>Files
                    <Icon name='sort' style={{marginLeft: '10px', cursor: 'pointer'}} onClick={sortFileLists}/>
                    </Card.Header>
                    
                </Card.Content>
                <Card.Content>
                    <Table basic='very' striped selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>Detail</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                fileList.map(file=>(
                                    <Popup
                                        trigger={
                                            <Table.Row key={file._id} style={{cursor: "default"}}>
                                        <Table.Cell>{file.title}</Table.Cell>
                                        <Table.Cell>{file.description}</Table.Cell>
                                        <Table.Cell>
                                            <div style={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                <b>Uploaded: </b>{getDate(file.createdAt)}
                                            </div>
                                            <div style={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                <b>{ file.uploadedBy.email}</b>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Popup
                                            trigger={<button style={{background: "red", border: 0, padding: "5px 10px", color: "#fff", cursor:"pointer"}} disabled={disabledButton} 
                                            className={disabledButton?"disable_btn":""} type="button" onClick={(e)=>deleteFile(file._id)}>Delete</button>}
                                            content="Click to delete file"
                                            />
                                            <Popup
                                            trigger={<button type="button" style={{background: "green", border: 0, padding: "5px 10px", color: "#fff", cursor:"pointer"}} className={disabledButton?"disable_btn":""} onClick={(e)=>downloadFile(file._id, file.title, file.file_path)} disabled={disabledButton}>Download</button>}
                                            content="Click to download file"
                                            />
                                            
                                        </Table.Cell>
                                    </Table.Row>
                                        }

                                        position="top center"
                                        flowing
                                        on={"click"}

                                        key={file._id}
                                    >
                                        <Popup.Header>{file.title}</Popup.Header>
                                        <Popup.Content>

                                            <Table>
                                                <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>File Type</Table.Cell>
                                                    <Table.Cell>{file.file_mimetype}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Uploaded On</Table.Cell>
                                                    <Table.Cell>{getDate(file.createdAt)}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Uploaded By</Table.Cell>
                                                    <Table.Cell>{file.uploadedBy.email}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Updated On</Table.Cell>
                                                    <Table.Cell>{getDate(file.updatedAt)}</Table.Cell>
                                                </Table.Row>
                                                </Table.Body>
                                            </Table>
                                        </Popup.Content>
                                    </Popup>
                                ))
                            }
                           
                        </Table.Body>

                    </Table>
                </Card.Content>
            </Card>
        </div>
    )
}
