const CLIENT_ID = 'eeff903cae28535861429678e150f740';
export const REDIRECT_URI = "http://localhost:3000/login/oauth2/kakao";
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
