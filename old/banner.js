//Change the banner

const { REST, Routes, DataResolver } = require("discord.js");

const rest = new REST().setToken(
  ""
);
(async () => {
    try {
      await rest.patch(Routes.user(), {
        body: { banner: await DataResolver.resolveImage("./images/gif2.gif") }
      });
      console.log("Banner updated successfully!");
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  })();