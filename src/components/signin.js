import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signinAction } from '../store/action/action';
import {
    Link
} from 'react-router-dom';
import Loader from 'react-loader-spinner'
import ErrorMessage from "./errorMessage"
import firebase from 'firebase';
import history from '../History';



class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // email: 'admin@intchat.com',
            email: '',
            password: ""
        }
        this.signin = this.signin.bind(this);
        this._onChangeEmail = this._onChangeEmail.bind(this);
        this._onChangePassword = this._onChangePassword.bind(this);

    }

    signin() {
        let user = {
            email: this.state.email,
            password: this.state.password
        }
        this.setState({
            email: '',
            password: ''
        })
        this.props.signinWithEmailPassword(user);
    }
    _onChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }
    _onChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }
    
 


    render() {
        return (
            <div>
                {/* <nav className="navbar navbar-light" >
                    <a className="navbar-brand" href="#">Messageri</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="#"><Link to='/signin'> Signin</Link> <span className="sr-only">(current)</span></a>
                            </li>
                           

                        </ul>
                        <span className="navbar-text">
                            Web portal for view chat list
                          </span>
                    </div>
                </nav>
                <hr />
                <hr /> */}

                <br />
                <br />
                <br />
                <br />

                <h1 className="headingCenter">Signin</h1>
                <div className="center">
                    <b className="input-group mb-6 inputCenter">Email Address</b>

                    <div className="input-group mb-6 inputCenter">
                        <input type="text" className="form-control " placeholder="Email Address" aria-label="Recipient's username" aria-describedby="basic-addon2" value={this.state.email} onChange={this._onChangeEmail} />
                    </div>
                    <b className="input-group mb-6 inputCenter">Password</b>

                    <div className="input-group mb-6 inputCenter" >
                        <input type="password" className="form-control" placeholder="Password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={this.state.password} onChange={this._onChangePassword} />
                    </div>
                    <button onClick={this.signin} className="btn btn-warning button ">Signin</button><br /><br />
                  <div>
                    <p className="headingCenter" style={{color:"blue"}}><Link to='/courseName'>Back to home</Link></p>
                  </div>
                  

                </div>
                <center>

                    {
                        (this.props.isLoader === true) ?
                            (<div style={{ marginTop: -30 }}>
                                <Loader type="ThreeDots" color="orange" height={80} width={80} />
                            </div>)
                            : null
                    }

                    {
                        (this.props.isError === true) ? (
                            <ErrorMessage errorMessge={this.props.errorMessage}></ErrorMessage>
                        ) : null
                    }

                </center>


                {/* <Loader type="Audio" color="#somecolor" height={80} width={80} />
                <Loader type="Ball-Triangle" color="#somecolor" height={80} width={80} />
                <Loader type="Bars" color="#somecolor" height={80} width={80} />
                <Loader type="Circles" color="#somecolor" height={80} width={80}/>
                <Loader type="Grid" color="#somecolor" height={80} width={80} />
                <Loader type="Hearts" color="#somecolor" height={80} width={80} />
                <Loader type="Oval" color="#somecolor" height={80} width={80} />
                <Loader type="Puff" color="#somecolor" height={80} width={80} />
                <Loader type="Rings" color="#somecolor" height={80} width={80} />
                <Loader type="TailSpin" color="#somecolor" height={80} width={80} /> */}
            </div>
        )
    }
}

function mapStateToProp(state) {
    return ({
        isLoader: state.root.isLoader,
        isError: state.root.isError,
        errorMessage: state.root.errorMessage,
        currentUser: state.root.currentUser,

    })
}
function mapDispatchToProp(dispatch) {
    return ({
        signinWithEmailPassword: (user) => {
            dispatch(signinAction(user))
        }
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(Signin);

