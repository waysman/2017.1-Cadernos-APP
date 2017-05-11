import { USER_SET, USER_SET_ERRORS, USER_SET_SENDING_DATA } from '../config/actions-types';

import axios, { setAuthorizationToken } from '../config/axios';

export const userSet = (user) => {
  return {
    type: USER_SET,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    }
  }
};

export const asyncCreateUser = (userData) => {
  return (dispatch) => {
    dispatch(userSendingData(true));

    axios.post(`/users`, {
      user: {...userData, email_confirmation: userData.email}
    })
    .then(feedBack => {
      setAuthorizationToken(feedBack.headers.auth_token);
      dispatch(userSet({...feedBack.data, password: userData.password}));
      dispatch(userSendingData(false));
    })
    .catch(err => {
      if (err.response && err.response.data){
        console.log(err.response.data);
        dispatch(userErrors(err.response.data));
      }else{
        console.log(err);

      }
      dispatch(userSendingData(false));
    });
  }

}
export const asyncEditUser = (userData) => {
  return (dispatch) => {
    dispatch(userSendingData(true));

    console.log(userData)/

    axios.patch(`/users/${userData.id}`, {
      user: {...userData, email_confirmation:userData.email}
    })
    .then(response => {
      setAuthorizationToken(response.headers.auth_token);
      dispatch(userSet({...response.data, password: userData.password}));
    })
    .catch(err => {
      console.log("ERROR");
      console.log(err);

      if (err.response && err.response.data) {
        // dispatch dos errors, pegar da brach createUser
        // dispatch(algumActionDeError(err.response.data))
      } else {
        // Um erro que não é da API, pode ser falta de internet e etc
      }
    })
    .finally(() => {
      dispatch(userSendingData(false));
    });
  }
}



export const userSendingData = (sendingData) =>{
  return {type: USER_SET_SENDING_DATA, sendingData}
}

export const userErrors = (errors) =>{
  return {
    type: USER_SET_ERRORS,
    errors
  }
}