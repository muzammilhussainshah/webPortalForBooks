import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { save, loaderCall, getBooksFromDb, deleteBook } from '../store/action/action';
import firebase from 'firebase';
// import { CSVLink, CSVDownload } from "react-csv";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import Modal from 'react-responsive-modal';
import Loader from 'react-loader-spinner'
// import history from '../History';
import ErrorMessage from "./errorMessage"
import FabIcon from "./fabIcon"
import "./buttonStyle.css"
import history from '../History';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import swal from 'sweetalert2'


// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Button from '@material-ui/core/Button';
// import AddIcon from '@material-ui/icons/Add';


import Input from '@material-ui/core/Input';


import DropzoneComponent from 'react-dropzone-component';
import '../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../node_modules/dropzone/dist/min/dropzone.min.css'




// const styles = theme => ({
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     input: {
//         margin: theme.spacing.unit,
//     },
// });

library.add(faPlus)


class ViewData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // open: false,
            courseName: "",
            batchNumber: "",
            bookName: "",
            classNumber: "",
            year: "",
            professor: "",
            downloadURL: "",
            data: [],
            search: "",
            resultFlag: false,
            userSignInFlag: false



        }
        this.djsConfig = {
            autoProcessQueue: false,
            addRemoveLinks: true,
            acceptedFiles: "application/pdf"
        };
        this.componentConfig = {
            iconFiletypes: ['.pdf'],
            showFiletypeIcon: true,
            postUrl: 'no-url'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        // this.callbackArray = [(files) => console.log('Hi!', files), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = (file) => {
            console.log('Hello!', file)
            this.setState({ pdfFile: file })
        };

        // this.success = file => console.log('uploaded', file);

        this.removedfile = file => {

            // if (file) {
            //     file.removeFile();
            // }
            this.setState({ pdfFile: null })
            console.log('removing...', file)
        };

        this.dropzone = null;


    }



    uploadPdf() {
        let courseName = this.state.courseName
        let batchNumber = this.state.batchNumber
        let bookName = this.state.bookName
        let classNumber = this.state.classNumber
        let year = this.state.year
        let professor = this.state.professor
        if (


            courseName.indexOf(".") !== -1 || courseName.indexOf("/") !== -1 ||
            batchNumber.indexOf(".") !== -1 || batchNumber.indexOf("/") !== -1 ||
            bookName.indexOf(".") !== -1 || bookName.indexOf("/") !== -1 ||
            classNumber.indexOf(".") !== -1 || classNumber.indexOf("/") !== -1 ||
            year.indexOf(".") !== -1 || year.indexOf("/") !== -1 ||
            professor.indexOf(".") !== -1 || professor.indexOf("/") !== -1



        ) {
            // alert(". and / invalid cherector")
            swal({
                type: 'error',
                title: 'Oops...',
                text: '. and / invalid character',
            })
        }

        else {
            if (!this.state.pdfFile || this.state.courseName === "" ||
                this.state.batchNumber === "" || this.state.bookName === "" ||
                this.state.classNumber === "" || this.state.year === "" || this.state.professor === "") {
                // alert("Please fill all fields")
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'All fields are required',
                })
            }
            else {
                this.props.loaderCall()
                const { pdfFile } = this.state
                // console.log(pdfFile, "pfd")
                var metadata = {
                    contentType: 'application/pdf',
                };
                const that = this
                var filename = pdfFile.name
                var storageRef = firebase.storage().ref('/pdfDocuments/' + filename);
                var upload = storageRef.put(pdfFile, metadata)
                upload.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    console.log(error, "error")
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        console.log('File available at', downloadURL);
                        // const { name, brand, images, model, code, summarySpecs, manufacture,
                        //     productType, series, date, product, pdf } = productObj
                        that.setState({
                            downloadURL: downloadURL,
                        })
                        let cloneBookData = {
                            courseName: that.state.courseName,
                            batchNumber: that.state.batchNumber,
                            bookName: that.state.bookName,
                            classNumber: that.state.classNumber,
                            year: that.state.year,
                            professor: that.state.professor,
                            downloadURL: that.state.downloadURL
                        }
                        that.props.save(cloneBookData)


                        that.setState({
                            courseName: "",
                            batchNumber: "",
                            bookName: "",
                            classNumber: "",
                            yearProfessor: "",
                            downloadURL: "",
                            pdfFile: null,
                            search: "",
                        })
                        window.location.reload()
                        // history.push('/ViewData')
                    });
                });
            }

        }

    }
    componentWillReceiveProps(nextProps) {
        let data = nextProps.data
        const { folderName } = this.props.location.state
        let filterData = []




        // console.log(data, "matched")



        data.filter((data) => {

            // for (var key in data) {
            //     data[key].trackId = key
            //     console.log(key, "key")

            // }


            if (data.folderName === folderName) {
                // console.log(data, "matched")
                for (var key in data) {
                    // console.log(data[key])
                    // data[key].trackId = key
                    filterData.push(data[key])
                }
                filterData.pop()
            }
        })


        // console.log(data, "matched")

        this.setState({
            data: filterData,
            forSearchCalcled: filterData
        })
    }

    componentWillMount() {
        this.props.getBooksFromDb();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                // history.push('/adminPannel')
                console.log("user is signin")
                this.setState({
                    userSignInFlag: true
                })
            } else {
                // No user is signed in.
                // history.push('/ViewData')
                console.log("no sign in")
                this.setState({
                    userSignInFlag: false
                })
                // window.location.reload()
            }
        });

    }

    logOut() {
        console.log("funck working")
        // let that = this;
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            history.push('/');
            this.setState({
                userSignInFlag: false
            })

            console.log("user logout")

        }, function (error) {
            // An error happened.
            console.log(error)

        });
    }

    _onChangeVlaue = name => event => {
        this.setState({ [name]: event.target.value })
    }

    admin() {
        history.push('/signin')
    }

    search() {
        let cloneSearchData = this.state.search
        let cloneData = this.state.data
        let sortedData = []
        for (var i = 0; i < cloneData.length; i++) {
            if (cloneData[i].bookName.slice(0, cloneSearchData.length).toLowerCase() === cloneSearchData.toLowerCase()) {
                // console.log(cloneData[i].bookName, "matched")
                sortedData.push(cloneData[i])
            }
        }

        if (sortedData.length === 0) {
            swal({
                // type: 'error',
                title: 'Oops...',
                text: 'No result found',
            })
            // alert("result not found")
            this.setState({
                data: sortedData,
                // search: "",
                resultFlag: true
            })
        }
        else {
            this.setState({
                data: sortedData,
                resultFlag: false
            })
        }
    }

    clearSearch() {
        let cloneData = this.state.forSearchCalcled
        this.setState({
            data: cloneData,
            search: "",
            resultFlag: false
        })
    }


    deleteBook(index) {
        let cloneBookData = this.state.data
        let pdfFilename = this.state.data[index].filename
        let bookId = cloneBookData[index].trackId
        cloneBookData.splice(index, 1)
        const { folderName } = this.props.location.state
        this.setState({
            data: cloneBookData,
        })

        // console.log(filename)

        this.props.deleteBook(bookId, folderName,pdfFilename)
    }


    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.callback,
            success: this.success,
            removedfile: this.removedfile
        }

        return (
            <div>
                <nav className="navbar navbar-dark bg-primary"
                    style={{ position: "fixed", zIndex: 1, width: "100%" }}
                >
                    <a className="navbar-brand" href="/">Books Portal


                    {

                            (this.state.userSignInFlag === true) ?
                                (<span>  (Admin)</span>)
                                : null

                        }

                    </a>


                    <div className="form-inline">
                        <div >
                            <input value={this.state.search} onChange={this._onChangeVlaue('search')} className="form-control mr-sm-2" type="search" placeholder="Search Book Name" aria-label="Search Book Name" />
                            {
                                (this.state.search !== "") ? (
                                    <span className="hoverCross" onClick={this.clearSearch.bind(this)} style={{ marginLeft: "-12%", color: "grey", fontWeight: "bold" }}>x</span>

                                ) : null
                            }
                        </div>
                        <button className="btn btn-warning" style={{ marginRight: 7 }} onClick={this.search.bind(this)} >Search</button>
                        {
                            (this.state.userSignInFlag === true) ?
                                (<button className="btn btn-warning" onClick={this.logOut.bind(this)} >Logout</button>
                                )
                                : (<button className="btn btn-warning" onClick={this.admin.bind(this)} >Admin</button>
                                )
                        }


                    </div>

                </nav>
                <center>

                    {/* {

                        (this.state.resultFlag === true) ?
                            (<div className="alert alert-warning" >
                                <strong>Result!</strong> Result not found.
                            </div>) : null

                    } */}




                    <br />
                    <br />
                    <br />
                    <br />

                    <FabIcon />
                    <h1
                    // style={{ fontSize: "2vw", }}
                    >
                        Available Books
                    </h1>

                    {/* <Input
                            style={{ width: "40%" }}
                            placeholder="Search"
                            inputProps={{
                                'aria-label': 'Description',
                                // 'margin':"2%"
                            }}
                        />
                        <button type="button" class="btn btn-outline-primary" style={{ margin: "1%" }}>Search</button> */}

                    <br />
                    <br />

                    {
                        (this.props.isLoader === true) ?
                            (<div style={{ marginTop: -30 }}>
                                <Loader type="ThreeDots" color="#fdbd37" height={80} width={80} />
                                <p>Loading....</p>
                            </div>)
                            : (

                                <table className="table table-striped listHeading" id="table-to-xls">
                                    <thead >
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Batch Number</th>
                                            <th>Book Name</th>
                                            <th>Class Number</th>
                                            <th>Year</th>
                                            <th>Professor</th>
                                            <th>Download</th>

                                            {
                                                (this.state.userSignInFlag === true) ?
                                                    (<th>Delete</th>
                                                    )
                                                    : null
                                            }

                                            {/* <th>Message Type</th> */}
                                            {/* <th>Download</th> */}
                                        </tr>
                                    </thead>
                                    <tbody
                                    // style={{ color: "darkgray" }}
                                    >
                                        {
                                            // this.state.data &&
                                            this.state.data.map((data, index) => {
                                                return (
                                                    // console.log(data,index,"in map")
                                                    <tr key={index}>
                                                        <td>{data.courseName}</td>
                                                        <td>{data.batchNumber}</td>
                                                        <td>{data.bookName}</td>
                                                        <td>{data.classNumber}</td>
                                                        <td>{data.year}</td>
                                                        <td>{data.professor}</td>
                                                        <td><a href={data.downloadURL} target="_blank"><button type="button" className="btn btn-warning">Download</button></a>
                                                        </td>

                                                        {
                                                            (this.state.userSignInFlag === true) ?
                                                                (
                                                                    <td><button type="button" className="btn btn-danger" onClick={this.deleteBook.bind(this, index)}>Delete Book</button>
                                                                    </td>
                                                                )
                                                                : null
                                                        }


                                                    </tr >
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>





                            )
                    }


                    {/* <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br /> */}

                    <div style={{
                        zIndex: 1,
                        position: "fixed",
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        textAlign: "center",
                        // backgroundColor:"#dee2e6"
                    }}>
                        <hr />

                        <p className="headingCenter" style={{ color: "blue", }}><Link to='/courseName'>Back to home</Link></p>
                    </div>

                    {/* <!-- Modal --> */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Upload Book</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">

                                    <div
                                        style={{ width: "80%", }}
                                    >
                                        <DropzoneComponent
                                            config={config}
                                            eventHandlers={eventHandlers}
                                            djsConfig={djsConfig}
                                        />
                                    </div>

                                    <Input
                                        style={{ width: "80%", margin: "5%", marginTop: "10%" }}
                                        placeholder="Course Name"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}
                                        value={this.state.courseName}
                                        onChange={this._onChangeVlaue('courseName')}
                                    />
                                    <Input
                                        style={{ width: "80%", margin: "5%", }}
                                        placeholder="Batch Number"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}
                                        value={this.state.batchNumber}
                                        onChange={this._onChangeVlaue('batchNumber')}
                                    />
                                    <Input
                                        style={{ width: "80%", margin: "5%", }}
                                        placeholder="Book Name"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}
                                        value={this.state.bookName}
                                        onChange={this._onChangeVlaue('bookName')}
                                    />
                                    <Input
                                        style={{ width: "80%", margin: "5%" }}
                                        placeholder="Class Name"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}

                                        value={this.state.classNumber}
                                        onChange={this._onChangeVlaue("classNumber")}

                                    />
                                    <Input
                                        style={{ width: "80%", margin: "5%" }}
                                        placeholder="Year"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}
                                        value={this.state.yearProfessor}

                                        onChange={this._onChangeVlaue("year")}

                                    />
                                    <Input
                                        style={{ width: "80%", margin: "5%" }}
                                        placeholder="Professor"
                                        inputProps={{
                                            'aria-label': 'Description',
                                        }}
                                        value={this.state.yearProfessor}

                                        onChange={this._onChangeVlaue("professor")}

                                    />

                                    {/* {(this.props.isLoader === true) ?
                                        (<div style={{ marginTop: -30 }}>
                                            <Loader type="ThreeDots" color="#fdbd37" height={80} width={80} />
                                        </div>)
                                        : null
                                    } */}

                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}

                                    {/* <button type="button" class="btn btn-warning">Download</button> */}

                                    <button style={{ marginRight: "10%", }} type="button" className="btn btn-warning"
                                        onClick={this.uploadPdf.bind(this)}

                                        data-dismiss="modal"
                                    >Click to Upload</button>

                                </div>
                            </div>
                        </div>
                    </div>










                    {
                        (this.props.isError === true) ? (
                            <ErrorMessage errorMessge={this.props.errorMessage}></ErrorMessage>
                        ) : null
                    }


                </center>
            </div >
        )
    }
}

function mapStateToProp(state) {
    return ({
        data: state.root.data,
        folderName: state.root.folderName,
        users: state.root.users,
        isLoader: state.root.isLoader,
        isError: state.root.isError,
        errorMessage: state.root.errorMessage,
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        loaderCall: () => {
            dispatch(loaderCall())
        },
        save: (data) => {
            dispatch(save(data))
        },
        getBooksFromDb: () => {
            dispatch(getBooksFromDb())
        },
        deleteBook: (bookId, folderName,pdfFilename) => {
            dispatch(deleteBook(bookId, folderName,pdfFilename))
        }
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(ViewData);



