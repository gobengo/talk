import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);
import * as actions from '../constants/auth';
import coralApi, {base} from '../helpers/response';

// Dialog Actions
export const showSignInDialog = (offset = 0) => ({type: actions.SHOW_SIGNIN_DIALOG, offset});
export const hideSignInDialog = () => ({type: actions.HIDE_SIGNIN_DIALOG});

export const changeView = view => dispatch =>
  dispatch({
    type: actions.CHANGE_VIEW,
    view
  });

export const cleanState = () => ({type: actions.CLEAN_STATE});

// Sign In Actions

const signInRequest = () => ({type: actions.FETCH_SIGNIN_REQUEST});
const signInSuccess = (user, isAdmin) => ({type: actions.FETCH_SIGNIN_SUCCESS, user, isAdmin});
const signInFailure = error => ({type: actions.FETCH_SIGNIN_FAILURE, error});
const emailConfirmError = () => ({type: actions.EMAIL_CONFIRM_ERROR});

export const fetchSignIn = (formData) => (dispatch) => {
  dispatch(signInRequest());
  coralApi('/auth/local', {method: 'POST', body: formData})
    .then(({user}) => {
      const isAdmin = !!user.roles.filter(i => i === 'ADMIN').length;
      dispatch(signInSuccess(user, isAdmin));
      dispatch(hideSignInDialog());
    })
    .catch(error => {
      if (error.metadata) {

        // the user might not have a valid email. prompt the user user re-request the confirmation email
        dispatch(signInFailure(lang.t('error.emailNotVerified', error.metadata)));
        dispatch(emailConfirmError());
      } else {

        // invalid credentials
        dispatch(signInFailure(lang.t('error.emailPasswordError')));
      }
    });
};

// Sign In - Facebook

const signInFacebookRequest = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST});
const signInFacebookSuccess = user => ({type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS, user});
const signInFacebookFailure = error => ({type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE, error});

export const fetchSignInFacebook = () => dispatch => {
  dispatch(signInFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

export const facebookCallback = (err, data) => dispatch => {
  if (err) {
    signInFacebookFailure(err);
    return;
  }
  try {
    const user = JSON.parse(data);
    dispatch(signInFacebookSuccess(user));
    dispatch(hideSignInDialog());
  } catch (err) {
    dispatch(signInFacebookFailure(err));
    return;
  }
};

// Sign Up Actions

const signUpRequest = () => ({type: actions.FETCH_SIGNUP_REQUEST});
const signUpSuccess = user => ({type: actions.FETCH_SIGNUP_SUCCESS, user});
const signUpFailure = error => ({type: actions.FETCH_SIGNUP_FAILURE, error});

export const fetchSignUp = formData => (dispatch) => {
  dispatch(signUpRequest());

  coralApi('/users', {method: 'POST', body: formData})
    .then(({user}) => {
      dispatch(signUpSuccess(user));
      setTimeout(() =>{
        dispatch(changeView('SIGNIN'));
      }, 3000);
    })
    .catch(error => {
      dispatch(signUpFailure(lang.t(`error.${error.message}`)));
    });
};

// Forgot Password Actions

const forgotPassowordRequest = () => ({type: actions.FETCH_FORGOT_PASSWORD_REQUEST});
const forgotPassowordSuccess = () => ({type: actions.FETCH_FORGOT_PASSWORD_SUCCESS});
const forgotPassowordFailure = () => ({type: actions.FETCH_FORGOT_PASSWORD_FAILURE});

export const fetchForgotPassword = email => (dispatch) => {
  dispatch(forgotPassowordRequest(email));
  coralApi('/account/password/reset', {method: 'POST', body: {email}})
    .then(() => dispatch(forgotPassowordSuccess()))
    .catch(error => dispatch(forgotPassowordFailure(error)));
};

// LogOut Actions

const logOutRequest = () => ({type: actions.LOGOUT_REQUEST});
const logOutSuccess = () => ({type: actions.LOGOUT_SUCCESS});
const logOutFailure = () => ({type: actions.LOGOUT_FAILURE});

export const logout = () => dispatch => {
  dispatch(logOutRequest());
  coralApi('/auth', {method: 'DELETE'})
    .then(() => dispatch(logOutSuccess()))
    .catch(error => dispatch(logOutFailure(error)));
};

// LogOut Actions

export const validForm = () => ({type: actions.VALID_FORM});
export const invalidForm = error => ({type: actions.INVALID_FORM, error});

// Check Login

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginSuccess = (user, isAdmin) => ({type: actions.CHECK_LOGIN_SUCCESS, user, isAdmin});
const checkLoginFailure = error => ({type: actions.CHECK_LOGIN_FAILURE, error});

export const checkLogin = () => dispatch => {
  dispatch(checkLoginRequest());
  coralApi('/auth')
    .then((result) => {
      if (!result.user) {
        throw new Error('Not logged in');
      }

      const isAdmin = !!result.user.roles.filter(i => i === 'ADMIN').length;
      dispatch(checkLoginSuccess(result.user, isAdmin));
    })
    .catch(error => {
      console.error(error);
      dispatch(checkLoginFailure(`${error.message}`));
    });
};

const confirmEmailRequest = () => ({type: actions.CONFIRM_EMAIL_REQUEST});
const confirmEmailSuccess = () => ({type: actions.CONFIRM_EMAIL_SUCCESS});
const confirmEmailFailure = () => ({type: actions.CONFIRM_EMAIL_FAILURE});

export const requestConfirmEmail = email => dispatch => {
  dispatch(confirmEmailRequest());
  return coralApi('/users/resend-confirm', {method: 'POST', body: {email}})
    .then(() => {
      dispatch(confirmEmailSuccess());
    })
    .catch(err => {
      console.log('failed to send email confirmation', err);

      // email might have already been confirmed
      dispatch(confirmEmailFailure());
    });
};
