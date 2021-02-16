const Mk2 = require("./lib/mk2");
const Inplayer = require("./lib/inplayer");
const Vimeo = require("./lib/vimeo");

const ora = require("ora");

const spinner = ora(``);

const restartSpinner = (newText, isSuccessful = true) => {
  if (isSuccessful) {
    spinner.succeed();
  }
  spinner.text = newText;
  spinner.start();
};

(async function init() {
  try {
    restartSpinner("Logging in", false);
    await Inplayer.login({
      email: "",
      password: "",
    });

    restartSpinner("Fetching free movies of the week");
    const films = await Mk2.getFilmsByEpisode("gregg-alastair-et-les-autres");
    const firstFilm = films[0];

    restartSpinner(`Fetching URL for ${firstFilm.data.title}`);
    const links = await Inplayer.getUrlFromVideo(firstFilm.data.video_id);

    restartSpinner(`Downloading ${firstFilm.data.title}`);
    await Vimeo.download(firstFilm.data.title, links);

    spinner.succeed();
  } catch (err) {
    console.log(err);
    spinner.fail();
  }
})();
