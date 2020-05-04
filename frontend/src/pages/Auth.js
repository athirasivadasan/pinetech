import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';
import { Redirect } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class AuthPage extends Component {
  state = {
    isLogin: true,
    startDate: new Date(),
    login_err: false,
    nameerr: false,
    emailerr: false,
    passworderr: false,
    doberr: false,
    signup_err: null,
    signup_msg:null
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.fname = React.createRef();
    this.lname = React.createRef();
    this.dob = React.createRef();
  }

  onChangeName = event => {
    const fname = this.fname.current.value;

    if (fname.trim().length === 0) {
      this.setState({ nameerr: true });
      return;
    } else {
      this.setState({ nameerr: false });
      return;
    }
  };
  onChangeEmail = event => {
    const email = this.emailEl.current.value;

    if (email.trim().length === 0) {
      this.setState({ emailerr: true });
      return;
    } else {
      this.setState({ emailerr: false });
      return;
    }
  };
  onChangePassword = event => {
    const password = this.passwordEl.current.value;

    if (password.trim().length === 0) {
      this.setState({ passworderr: true });
      return;
    } else {
      this.setState({ passworderr: false });
      return;
    }
  };



  handleChange = date => {
    this.setState({
      startDate: date
    });
    const dob = this.state.startDate;

    if (!dob) {
      this.setState({ doberr: true });
      return;
    } else {
      this.setState({ doberr: false });
      return;
    }
  };
  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      this.setState({
        token: localStorage.getItem("token"),
        isLoading: false
      });
      return <Redirect from="/auth" to="/home" exact />
    }
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.setState({
        userId: localStorage.getItem("userId"),
        isLoading: false
      });
    }
    if (!token) {
      return <Redirect from="/home " to="/auth" exact />
    }

  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
    this.setState({ login_err: null });
    this.setState({ signup_err: null });
    this.setState({ signup_msg: null });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    const fname = this.fname.current.value;
    const lname = this.lname.current.value;
    const dob = this.state.startDate;

    this.setState({signup_err: null });
    this.setState({signup_msg: null});



    if (!this.state.isLogin) {

      if (fname.trim().length === 0) {
        this.setState({ nameerr: true });
        return;
      }
      if (email.trim().length === 0) {
        this.setState({ emailerr: true });
        return;
      }
      if (password.trim().length === 0) {
        this.setState({ passworderr: true });
        return;
      }
      if (!dob) {
        this.setState({ doberr: true });
        return;
      }
    }

    if (email.trim().length === 0) {
      this.setState({ emailerr: true });
      return;
    }
    if (password.trim().length === 0) {
      this.setState({ passworderr: true });
      return;
    }



    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {


      requestBody = {
        query: `
          mutation CreateUser($fname: String!,$lname: String!,$email: String!, $password: String!,$dob: String!) {
            createUser(userInput: {fname:$fname,lname:$lname,email: $email, password: $password, dob:$dob}) {
              _id
              email
            }
          }
        `,
        variables: {
          fname: fname,
          lname: lname,
          email: email,
          password: password,
          dob: dob

        }
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({ login_err: true });
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {

        if (resData.data.login) {
          if (resData.data.login.token) {
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
            this.setState({ login_err: false });
            localStorage.setItem("token", resData.data.login.token);
            localStorage.setItem("userId", resData.data.login.userId);



          }
        }
        else {
          if (resData.data.createUser) {
            this.setState({
              signup_msg: "User creation successful!"
            });
            
          }

          else if (resData.errors) {
            this.setState({
              signup_err: resData.errors[0].message
            });

          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div >
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-actions">
            <h3>{this.state.isLogin ? 'Login' : 'Signup'}</h3>

          </div>
          <div className="form-actions">
            <div className={
              this.state.login_err ? "notif error show" : "notif error hide"
            } >Authentication Failed!</div>
            <div className="notif error show">{this.state.signup_err}</div>
            <div className="notif message show">{this.state.signup_msg}</div>
          </div>

          <div className={
            this.state.isLogin ? "form-control hide" : "form-control show"
          }>
            <label htmlFor="fname">First Name</label>
            <input type="text" id="fname" ref={this.fname} onChange={this.onChangeName} />
            <span className={this.state.nameerr ? "error show" : "error hide"}>Required!</span>
          </div>
          <div className={
            this.state.isLogin ? "form-control hide" : "form-control show"
          }>
            <label htmlFor="lname">Last Name</label>
            <input type="lname" id="text" ref={this.lname} />
          </div>


          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" ref={this.emailEl} onChange={this.onChangeEmail} />
            <span className={this.state.emailerr ? "error show" : "error hide"}>Required!</span>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={this.passwordEl} onChange={this.onChangePassword} />
            <span className={this.state.passworderr ? "error show" : "error hide"}>Required!</span>
          </div>
          <div className={
            this.state.isLogin ? "form-control hide" : "form-control show"
          }>
            <label htmlFor="dob">Date of birth</label>
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
              id="dob" ref={this.dob}
            />
            <span className={this.state.doberr ? "error show" : "error hide"}>Required!</span>
          </div>


          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.isLogin ? 'Signup' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AuthPage;
