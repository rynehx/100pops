//React
var React = require('react'),
    ReactDOM = require('react-dom'),
    ReactRouter = require('react-router');
//Routes
var Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    hashHistory = ReactRouter.hashHistory;
//actions
var PhotosClientActions = require('./actions/PhotosClientActions');
var UserClientActions = require('./actions/UserClientActions');
var GalleryClientActions = require('./actions/galleryClientActions');
//stores
var PhotoStore = require('./stores/photosStore');
var UserStore = require('./stores/userStore');
var GalleryStore = require('./stores/galleryStore');
//components
var HomePage = require("./components/homePage");
var PhotoContent = require('./components/photoContent');
var NotificationPanel = require('./components/notificationPanel');


var App = React.createClass({

  getInitialState: function () {
    return { user: undefined };
  },

  componentWillMount: function(){
    _500px.getAuthorizationStatus(function (status) {
      if(status === "authorized"){
        UserClientActions.fetchCurrentUser();
      }
    });

  },

  componentWillUnmount: function(){
    this.currentUserListener.remove();
  },

  componentDidMount: function(){
    this.currentUserListener = UserStore.addListener(this._onUserChange);
  },

  _onUserChange: function(){
    var user = UserStore.fetchCurrentUser();
    this.setState({user: user});
  },

  _handleLogin: function(){ // shows login button if no user is logged in or user photo/logout if a user is logged in
    var login;
    if(this.state.user){
      login =
      <div className = "current-user-container">
        <img className = "current-user-picture" src = {this.state.user.userpic_url}></img>
        <div className = "logout-button" onClick = {function(){
            _500px.logout(function(response){
              UserClientActions.fetchCurrentUser();
            });
          }}>
          Logout
        </div>
      </div>;
    }else{
      login =
      <div className = "current-user-container">
        <div className = "login-button" onClick = {function(){
            _500px.login(function(response){
              UserClientActions.fetchCurrentUser();
            });
          }}>
          Login
        </div>
      </div>;
    }

    return <div className = "login-container">
      {login}
    </div>

  },

  render: function(){
    return (
      <div className = "container">
        <div className = "navbar">
          {this._handleLogin()}
        </div>
        {this.props.children}
        <NotificationPanel />
      </div>
    );
  }
});

var AppRouter = (
  <Router history={hashHistory}>
    <Route path="/" components={App}>
      <IndexRoute components={PhotoContent}/>
      <Route path=":tabType"  components={PhotoContent}/>
    </Route>
  </Router>
);


document.addEventListener('DOMContentLoaded', function(){//renders after DOM is loaded
  _500px.init({
     sdk_key: '440b39a5a88d1dc3dc7536a15d2e50cd093e9c69'
   });

  var root = document.getElementById('content');
  ReactDOM.render(AppRouter,root);
});
