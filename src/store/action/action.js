
import ActionTypes from '../constant/constant';
import history from '../../History';
import firebase from 'firebase';
import { userInfo } from 'os';
// import createBrowserHistory from 'history/createBrowserHistory';
// const history = createBrowserHistory()

var config = {
    apiKey: "AIzaSyD7rir292hhpbCjVQQvq8K16KB4Dy3PICM",
    authDomain: "bookportal-pk.firebaseapp.com",
    databaseURL: "https://bookportal-pk.firebaseio.com",
    projectId: "bookportal-pk",
    storageBucket: "bookportal-pk.appspot.com",
    messagingSenderId: "133732568746"
};
firebase.initializeApp(config);

export function loaderCall() {
    return dispatch => {
        dispatch({ type: ActionTypes.LOADER })
    }
}



export function signinAction(user) {
    return dispatch => {
        dispatch({ type: ActionTypes.LOADER })
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)

            .then((userData) => {

                console.log("user signed in")
                history.push('/');
                dispatch({ type: ActionTypes.LOADER })

            })
            // .then((signedinUser) => {
            //     let currentUserUid = firebase.auth().currentUser.uid;
            //     firebase.database().ref('users/' + currentUserUid).once('value')


            // })
            .catch((error) => {
                var errorMessage = error.message;
                console.log(errorMessage);
                dispatch({ type: ActionTypes.SHOWERROR, payload: errorMessage })
                setTimeout(() => {
                    dispatch({ type: ActionTypes.HIDEERROR })
                }, 3000)
            })
    }
}





export function save(data) {
    return dispatch => {
        let courseNameAndBatchName = data.courseName + " " + data.batchNumber
        console.log(courseNameAndBatchName, "courseNameAndBatchName")
        firebase.database().ref('/books/' + courseNameAndBatchName).push(data)
            .then(() => {
                dispatch({ type: ActionTypes.LOADER })
            })
            .catch((error) => {
                var errorMessage = error.message;
                // alert(errorMessage)
                console.log(errorMessage, "save book data");
                dispatch({ type: ActionTypes.SHOWERROR, payload: errorMessage })
                setTimeout(() => {
                    dispatch({ type: ActionTypes.HIDEERROR })
                }, 3000)
            })
    }
}
export function deleteBook(bookId, folderName, pdfFilename) {
    return dispatch => {
        // console.log(pdfFilename, "delete func in action")
        firebase.database().ref("/books/" + folderName + "/" + bookId).remove()

        // Create a reference to the file to delete
        var desertRef = firebase.storage().ref('/pdfDocuments/').child(pdfFilename);

        // Delete the file
        desertRef.delete().then(function () {
            // File deleted successfully


            console.log("File deleted successfully")
        }).catch(function (error) {
            // Uh-oh, an error occurred!

            console.log(error)

        });




    }
}

export function getBooksFromDb() {
    return dispatch => {
        dispatch({ type: ActionTypes.LOADER })
        firebase.database().ref("/books/").once('value', (snapshot) => {
            let obj = snapshot.val();

            for (var key in obj) {
                // console.log(obj[key]),"1st loop"
                let data = obj[key]
                for (var datakey in data) {
                    data[datakey].trackId = datakey
                    // console.log(data[datakey]), "1st loop"
                }
            }
            let data = [];
            let courseName = [];
            for (var key in obj) {
                courseName.push(obj.folderName = key)
                obj[key].folderName = key
                // console.log(obj[key], "dataSort")
                // var dataSort = obj[key]
                // console.log(dataSort, "key")


                // for (var i = 0; )



                // for (var key in dataSort) {
                //     // dataSort[key].trackId = key
                //     // data.push(dataSort[key])
                //     console.log(key, "key")
                // }




                data.push(obj[key])


            }

            // console.log(data, "dataSort")

            dispatch({ type: ActionTypes.FOLDERNAME, payload: courseName })
            dispatch({ type: ActionTypes.DATA, payload: data })
            dispatch({ type: ActionTypes.LOADER })
        })
            .catch((error) => {
                var errorMessage = error.message;
                console.log(errorMessage);
                dispatch({ type: ActionTypes.SHOWERROR, payload: errorMessage })
                setTimeout(() => {
                    dispatch({ type: ActionTypes.HIDEERROR })
                }, 3000)
            })

    }
}

