import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import validator from 'validator';
import Input from 'react-validation/build/input';
import Form from 'react-validation/build/form';
import Navigation from './Navigation';
import { Redirect } from 'react-router'
import '../css/SigninForm.css';
import createBrowserHistory from 'history/createBrowserHistory'

const appHistory = createBrowserHistory()

export default class SignInForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      status: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let popup = this;
    const { email, password } = this.state;
    axios.post('http://localhost:3001/signin', { email, password })
    //.then((response) => this.setState({ status: response.data.message}))
    .then(axios.get(`http://localhost:3001/id/${email}`)
      .then(function (response) {
        sessionStorage.setItem('id', response.data.id);
        sessionStorage.setItem('name', response.data.firstname);
        if(response.data.id) popup.props.logInClicked();
      })
    );
  }
  render() {
      /*const { status } = this.state;
      if(status === "200") {
        return <Redirect to='/' />;
      }*/

      const required = (value) => {
        if (!value.toString().trim().length) {
          return (
            <span className="error-text">required field</span>
          )
        }
      };

      const email = (value) => {
        if (!validator.isEmail(value)) {
          return `${value} is not a valid email.`
        }
      };

      return (
        <div className="content">
          <h3 className="description">Sign in to see some cool dogs.</h3>
          <img className="image" src="https://bucsblade.com/wp-content/uploads/2016/12/paw-prints.jpg"  />
          <Form onSubmit={this.handleSubmit}>
            <div className="inputBox">
              <Input type="email" className="SigninInput" placeholder="Email" name="email" value={this.state.email} validations={[required, email]} onChange={this.handleChange} />
              <Input type="password" className="SigninInput" placeholder="Password" type="password" name="password" value={this.state.password} validations={[required]} onChange={this.handleChange} />
            </div>
            <button className="SigninButton" type="submit" value="Submit" id="createUser">Sign in</button>
          </Form>
        </div>
    );
  }
}
