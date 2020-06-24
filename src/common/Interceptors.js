
class Interceptors {

  responseFailureHandler = (error, handleForbiddenError) => {
    if (error) {
      document.getElementsByClassName('spinnerWrapper')[0].classList.add('hide');
      document.getElementsByClassName('spinnerWrapper')[0].classList.remove('show');
      const handlingErr = error;
      switch (true) {
        case (error.response && error.response.status === 401):
          // Router.push('/login')
          break;
        case (error.message && error.message.indexOf('timeout') >= 0 && handleForbiddenError):
        case (error.response && error.response.status === 403 && handleForbiddenError):
          if (error.message.indexOf('timeout') >= 0) {
            handlingErr.response = { status: 408 };
          }
          handleForbiddenError(handlingErr);
          break;
        default:
          return true;
      }
    }
    return false;
  };

  addResponseInterceptors = (axiosInstance, handleForbiddenError = null) => {
    if (
      axiosInstance
      && axiosInstance.interceptors
      && axiosInstance.interceptors.response
      && typeof axiosInstance.interceptors.response.use === 'function'
    ) {
      axiosInstance.interceptors.response.use(
        response => {
          document.getElementsByClassName('spinnerWrapper')[0].classList.add('hide');
          document.getElementsByClassName('spinnerWrapper')[0].classList.remove('show');
          return response;
        },
        error => this.responseFailureHandler(error, handleForbiddenError)
      );
    }
  }

  addRequestInterceptors = (axiosInstance, apiHeader, urlSuffix) => {
    if (
      axiosInstance
      && axiosInstance.interceptors
      && axiosInstance.interceptors.request
      && typeof axiosInstance.interceptors.request.use === 'function'
    ) {
      axiosInstance.interceptors.request.use((config) => {
        document.getElementsByClassName('spinnerWrapper')[0].classList.add('show');
        document.getElementsByClassName('spinnerWrapper')[0].classList.remove('hide');
        const newConfig = config;
        return newConfig;
      });
    }
  }
}

export default Interceptors;


/** 
 * import the Interceptors
 * in clients.jsx before exporting that file,
 * add const interceptors = new Interceptors();
 * then:===> interceptors.addResponseInterceptors(tradeMarketListClients)
 * interceptors.addResponseInterceptors(getCurrencyPriceClients)
 * ....like these we need to add all the clients for 401.
 * */
