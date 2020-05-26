import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import combineReducers from "./reducers/index";
import { PersistGate } from 'redux-persist/integration/react';
import SideNavBar from './components/SideNavBar/SideNavBar';
import Dashboard from './pages/Dashboard/Dashboard';
import CandidateUploadContainer from './pages/CandidateUpload/container/CandidateUploadContainer';
import ReportContainer from './pages/Report/container/ReportContainer';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.scss';



const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, combineReducers)
const composeEnhancers = compose;

// let store = createStore(persistedReducer, 
//   applyMiddleware(thunk)
// );

let store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk)
));

let persistor = persistStore(store);


class App extends React.Component {

  render() {
    return (
      <div className='appContainer sb-nav-fixed'>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Header history={this.props.history} />
            <div id="layoutSidenav" className='routerContent'>
              <SideNavBar history={this.props.history} />
              <div id="layoutSidenav_content">
                <Switch>
                  <Route path="/" component={Dashboard} exact/>
                  <Route path="/report" component={ReportContainer} />
                  <Route path="/candidateUpload" component={CandidateUploadContainer} />
                </Switch>
                <Footer />
              </div>
            </div>

          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default withRouter(App);
