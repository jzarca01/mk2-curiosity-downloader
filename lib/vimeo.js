const util = require("util");
const exec = util.promisify(require("child_process").exec);

const slugify = require("slugify");

class Vimeo {
  async download(itemName, itemUrl) {
    try {
      const { stdout, stderr } = await exec(
        `ffmpeg -i "${itemUrl}" -codec copy ~/Desktop/${slugify(itemName)}.mkv`
      );
      console.log("stdout:", stdout);
      console.error("stderr:", stderr);
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Vimeo();
