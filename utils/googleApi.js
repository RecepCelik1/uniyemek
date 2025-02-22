const axios = require('axios')

const fetchTokenData = async (OAuthCode) => {
    const data = {
        code: OAuthCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_ID_SECRET,
        redirect_uri: "http://localhost:3000/google/callback",
        grant_type: "authorization_code",
    }
    const response = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL, data).catch((error) => {throw new Error("ErrorOccured")});
    return response?.data;
}

const fetchTokenInfo = async (idToken) => {
    const token_info_response = await axios.get(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${idToken}`
    ).catch((error) => {throw new Error("FailedToFetchTokenInfo");});
    return token_info_response?.data;
}

module.exports = {
    fetchTokenData,
    fetchTokenInfo
}