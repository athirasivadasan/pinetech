import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import './Home.css';

class HomePage extends Component {
  state = {
    isLoading: false,
    outputType: 'list',
    fname: null,
    lname: null,
    email: null,
    dob: null,
    id: null
  };
  isActive = true;
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchUser();

  }



  async fetchUser() {
    await this.setState({ id: localStorage.getItem("userId") });

    const userId = localStorage.getItem("userId");


    let requestBody = {
      query: `
        query UserDetails($userId: String!) {
          userDetails(userId: $userId) {
            userId    
            fname   
            lname     
            email
            dob
          }
        }
      `,
      variables: {
        userId: userId
      }
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.userDetails) {
          if (this.isActive) {


            this.setState({ fname: resData.data.userDetails.fname });
            this.setState({ lname: resData.data.userDetails.lname });
            this.setState({ email: resData.data.userDetails.email });
            this.setState({ dob: resData.data.userDetails.dob });
            this.setState({ isLoading: false });
          }

        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  static contextType = AuthContext;



  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          {this.state.isLoading ? (
            <Spinner />
          ) : (
              <div>
                <div className="form-actions">

                  
                  <p>Welcome to Pinetech,</p>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry,Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                </div>
                <div className="form-actions fdiv">

                  <p className="fname">Hi {this.state.fname} {this.state.lname} ,</p>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
                </div>


                <div className="card">


                  <h1 className="fname">{this.state.fname} {this.state.lname} </h1>
                  <p className="title">Employee</p>
                  <p>{this.state.email}</p>
                  <p> {new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "2-digit" }).format(this.state.dob)}</p>
                  <p><button>Contact</button></p>
                </div>

              </div>
            )}
        </React.Fragment >
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default HomePage;
