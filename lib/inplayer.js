const axios = require("axios");
const qs = require("qs");
const getUrls = require('get-urls');

class Inplayer {
  constructor() {
    this.request = axios.create({
      baseURL: "https://services.inplayer.com",
    });
    this.accessToken = null;

    this.request.interceptors.request.use(
      (axiosConfig) => {
        if (axiosConfig.url !== "/accounts/authenticate") {
          Object.assign(axiosConfig.headers, {
            Authorization: `Bearer ${this.accessToken}`,
          });
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  async login({ email, password }) {
    try {
      const response = await this.request({
        method: "POST",
        url: "/accounts/authenticate",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          client_id: "3c9d2ed1-32b0-400b-8269-707c4b23412c",
          grant_type: "password",
          username: email,
          password: password,
        }),
      });
      const { access_token } = response.data;
      this.setAccessToken(access_token);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async getUrlFromVideo(videoId) {
    try {
      const response = await this.request({
        method: "GET",
        url: `/items/${videoId}/access`,
      });
      const { item } = response.data;
      return [...getUrls(item.content)].find(item => item.indexOf('vimeo') > -1);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Inplayer();
