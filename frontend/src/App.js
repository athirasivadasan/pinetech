import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import HomePage from './pages/Home';


import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
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


  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });

    localStorage.clear();

  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/home" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/home" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}

                {this.state.token && (
                  <Route path="/home" component={HomePage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
