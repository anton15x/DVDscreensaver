// config file settings:
// https://cspell.org/configuration/

// vs code extension settings:
// https://streetsidesoftware.com/vscode-spell-checker/docs/configuration/#code-spell-checker

/** @type { import("@cspell/cspell-types").CSpellUserSettings } */
module.exports = {
  // Version of the setting file. Always 0.2
  "version": "0.2",
  // language - current active spelling language
  "language": "en",
  "ignorePaths": [
    "coverage",
    "dist",
    "docs",
    "node_modules/**",
    "*.svg",
  ],
  // words - list of words to be always considered correct
  "words": [
    "dvdlogo",
    "Hinterhofer",
  ],
}
