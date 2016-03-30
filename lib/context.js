'use strict';

(function () {

  var path = require('path'),
      fs = require('fs-extra'),
      _ = require('lodash'),
      ignoreFilePath = path.join(process.cwd(), '.chcpignore'),
      DEFAULT_IGNORE_LIST = [] || ['.DS_Store', 'node_modules/*', 'node_modules\\*', 'chcp.json', 'chcp.manifest', '.chcp*', '.gitignore', '.git', 'package.json'];

  module.exports = {
    context: context
  };

  function context(argv) {
    return new Context(argv);
  }

  var Context = function Context(argv) {
    if (argv) {
      this.argv = argv;
    } else {
      this.argv = {};
    }

    this.defaultConfig = path.join(process.cwd(), this.argv.c || 'jchm.json');
    this.sourceDirectory = getSourceDirectory(argv);
    this.manifestFilePath = path.join(this.sourceDirectory, this.argv.m || 'hybrid.manifest.json');
    this.projectsConfigFilePath = path.join(this.sourceDirectory, this.argv.r || 'release.json');
  };

  Context.prototype.ignoredFiles = function () {
    if (this.__ignoredFiles) {
      return this.__ignoredFiles;
    }

    this.__ignoredFiles = DEFAULT_IGNORE_LIST;
    var projectIgnore = '';

    try {
      projectIgnore = fs.readFileSync(ignoreFilePath, {
        encoding: 'utf-8'
      });
    } catch (e) {
    }

    if (projectIgnore.length > 0) {
      _.assign(this.__ignoredFiles, _.trim(projectIgnore).split(/\n/));
    }

    return this.__ignoredFiles;
  };

  function getSourceDirectory(argv) {
    var defaultDir = path.join(process.cwd(), 'www'),
        consoleArgs = argv._;

    if (!consoleArgs || consoleArgs.length !== 2) {
      return defaultDir;
    }

    return path.join(process.cwd(), consoleArgs[1]);
  }
})();