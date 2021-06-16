import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { Card, Grid ,Feed,Icon} from 'semantic-ui-react';
import download from 'downloadjs';

export default function AdminDefault() {
    const [latestFilesList, setLatestFilesList] = useState([]);
    const [myFilesList, setMyFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  
  const getLatestFilesList = () =>{
    axios.get(`${API_URL}/getLatestFiles`,{withCredentials: true})
    .then(res=>{
        if(res.status === 200){
            setLatestFilesList(res.data);
            setErrorMsg('');
        }else{
            throw Error('Error fetching data');
        }
    })
    .catch(err=>{
        console.log(err);
        setErrorMsg(err.message);
    })
}

  useEffect(() => {
    getLatestFilesList();
  },[]);

  const getMyFilesList = () =>{
    axios.get(`${API_URL}/getMyFiles`,{withCredentials: true})
    .then(res=>{
        if(res.status === 200){
            setMyFilesList(res.data);
            setErrorMsg('');
        }else{
            throw Error('Error fetching data');
        }
    })
    .catch(err=>{
        console.log(err);
        setErrorMsg(err.message);
    })
}

  useEffect(() => {
    getMyFilesList();
  },[]);

  
//   const deleteFile = (id,filesList) =>{
//     //console.log(typeof id)
//     let url=`${API_URL}/delete/${id}`;
//     axios.delete(url,{withCredentials: true})
//     .then(res=>{
//       //console.log(res)
//       //console.log(filesList)
//       const newData=filesList.filter(file => id !== file._id)
//       //console.log(newData)
//       setFilesList(newData);
//       //console.log(filesList);
//       setErrorMsg('');
//     })
//   };
  
    const downloadFile = async (id, path, mimetype) => {
      try {
        const result = await axios.get(`${API_URL}/download/${id}`,{withCredentials: true}, {
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


function dateFormat(date) {
    const day = date.getDate();
    const dayString = day >= 10 ? day : `0${day}`;
    return `${dayString}`;
  }

function countDate(date){
    const count= (dateFormat(new Date())-dateFormat(new Date(`${date}`)))
    if(count===0){
        return 'Today';
    }else if(count===1){
        return `${count} day ago`
    }else{
        return `${count} days ago`
    }
}


    const Cards = (props)=>{
        const { header, fileList } = props;
        return(
            <>
            {errorMsg && <p className="errorMsg">{errorMsg}</p>}
            <Card centered fluid>
            <Card.Content>
                <Card.Header>{header}</Card.Header>
            </Card.Content>
            <Card.Content>
            {fileList.map((file, index) => (
            <Feed>
                <Feed.Event>
                    <Feed.Content>
                        <Feed.Date content= {countDate(file.createdAt)} />
                        <Feed.Summary>
                        {file.title}
                        <i class="download icon" style={{float: 'right',cursor: 'pointer'}}  onClick={()=>downloadFile(file._id, file.file_path, file.file_mimetype)}></i>
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
            ))}
            </Card.Content>
         </Card>
         </>
        )
    }

    return (
        <div>
            <Grid divided>
                <Grid.Row>
                    <Grid.Column width="6">
                        <Cards header="Recent Uploads" fileList={latestFilesList}/>
                        <Cards header="My Uploads" fileList={myFilesList}/>
                        {/* <Cards header="Important"/> */}
                    </Grid.Column>
                    <Grid.Column width="10">
                        <Card fluid>
                        <Card.Content>
                            <Card.Header>Recent active users</Card.Header>
                        </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}




        // <div>
        //     <Grid columns="equal">
        //         <Grid.Row>
        //             <Grid.Column>
        //                 <Card fluid>
        //                 <Card.Content>
        //                     <Card.Header>Passed Eventsz</Card.Header>
        //                 </Card.Content>
        //                 </Card>
        //             </Grid.Column>
        //             <Grid.Column>
        //                 <Card fluid>
        //                 <Card.Content>
        //                     <Card.Header>Recent active users</Card.Header>
        //                 </Card.Content>
        //                 </Card>
        //             </Grid.Column>
        //         </Grid.Row>
        //     </Grid>
        // </div>