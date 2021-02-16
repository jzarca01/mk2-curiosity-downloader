const axios = require("axios");

class Mk2 {
  constructor() {
    this.request = axios.create({
      baseURL: "https://www.mk2curiosity.com/page-data",
    });
  }

  async getEpisodes() {
    try {
      const response = await this.request({
        method: "GET",
        url: "/index/page-data.json",
      });
      return response.data.result.data.allPrismicEpisode.edges;
    } catch (err) {
      console.log("err", err);
    }
  }

  async getEpisodeBySlug(slug) {
    try {
      const response = await this.request({
        method: "GET",
        url: `/episode/${slug}/page-data.json`,
      });
      return response.data.result.data.prismicEpisode;
    } catch (err) {
      console.log("err", err);
    }
  }

  async getFilmsByEpisode(episodeSlug) {
    try {
      const episode = await this.getEpisodeBySlug(episodeSlug);
      return episode.data.films
        .map((film) => film.film.document)
        .filter((film) => film.data.video_player === "InPlayer");
    } catch (err) {
      console.log("err", err);
    }
  }
}

module.exports = new Mk2();
