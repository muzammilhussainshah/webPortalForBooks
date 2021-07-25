import React, { Component } from 'react';
// import { View, Text, StyleSheet, style } from 'react-native';


class ErrorMessage extends Component {

    render() {
        return (
            <div>
                <p
                    style={
                        {
                            color: "red"
                        }
                    }
                >
                    {this.props.errorMessge}
                </p>
            </div>
        );
    }
}

export default ErrorMessage;



// const styles = StyleSheet.create({

//     errorStyle: {
//         color: "red",
//         textAlign: "center",
//         width: '80%', marginLeft: '10%', marginRight: '10%', 

//     }


// });

