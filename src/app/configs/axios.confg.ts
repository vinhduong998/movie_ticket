import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**

 * Timeout for 10 second

 */

axios.defaults.timeout = 20000;

let Reset = "\x1b[0m";
let Bright = "\x1b[1m";
let FgGreen = "\x1b[32m";
let BgGreen = "\x1b[42m";
let BgBlue = "\x1b[44m";

const setupAxiosInterceptors = () => {
  const onRequestSuccess = async (axios_config: InternalAxiosRequestConfig<any>) => {
    //add token here
    if (__DEV__) {
      console.info("==========<<<<<<<<<<<<<<<START AXIOS<<<<======================")
      let Method = String(axios_config.method).toUpperCase();
      console.log(Bright + BgBlue + ` ${Method} ` + Reset, FgGreen + axios_config.url + Reset);
    }
    return axios_config;
  };

  const onResponseSuccess = async (response: AxiosResponse) => {
    let Method = String(response.config.method).toUpperCase();
    if (__DEV__) {
      console.log(Bright + BgBlue + ` ${Method} ` + Reset, FgGreen + response.config.url + Reset);
    }
    return response;

  };

  axios.interceptors.request.use(onRequestSuccess);


  axios.interceptors.response.use(
    onResponseSuccess,
    async error => {
      const originalRequest = error.config;
      // handle refresh token here
      return Promise.reject(error);
    }
  );
}

export default setupAxiosInterceptors
