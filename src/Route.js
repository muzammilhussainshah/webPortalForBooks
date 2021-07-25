import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import ViewData from './components/viewData';
import CourseName from './components/courseName';
import Signin from './components/signin';
import history from './History';
class Routers extends Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={CourseName} />
                    <Route exact path="/courseName" component={CourseName} />
                    <Route exact path="/ViewData" component={ViewData} />
                    <Route exact path="/signin" component={Signin} />


                </div>
            </Router>
        )
    }
}

export default Routers;



