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
    const episode = await Mk2.getEpisodeOfTheWeek();
    const films = await Mk2.getFilmsByEpisode(episode.uid);

    console.log(`\nThere are ${films.length} movies available for download\n`)

    for (const film of films) {
      restartSpinner(`Fetching URL for ${film.data.title}`);
      const links = await Inplayer.getUrlFromVideo(film.data.video_id);
      restartSpinner(`Downloading ${film.data.title}`);
      await Vimeo.download(film.data.title, links);
      spinner.succeed();
    }
  } catch (err) {
    console.log(err);
    spinner.fail();
  }
})();
