import React from 'react';
import { withRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import combineReducers from "./reducers/index";
import { PersistGate } from 'redux-persist/integration/react';
import Home from './Home';
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


const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#1b91e5',
    }
  },
});
class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={outerTheme}>
        <div className='appContainer sb-nav-fixed'>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Home history={this.props.history} />
            </PersistGate>
          </Provider>
        </div>
      </ThemeProvider>
    );
  }
}

export default withRouter(App);
