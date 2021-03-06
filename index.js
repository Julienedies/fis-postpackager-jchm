/**
 * Created by Julien on 2016/3/15.
 */



'use strict';

var fs = require("fs");
var util = require("util");
var crypto = require('crypto');

function createHash(content){
    var data = new Buffer(content, 'utf-8');
    var hash = crypto.createHash('md5');
    hash.update(data, 'utf8');
    return hash.digest('hex');
}

module.exports = function (ret, conf, settings, opt) {

    var root = fis.project.getProjectPath();
    var ns = fis.config.get("namespace");
    var md5Connector = fis.config.get("project.md5Connector");

    var fileArray = [];

    fis.util.map(ret.src, function (id, file) {

        var type = file.rExt.replace(".", "");

        var hash = file.getHash();

        fileArray.push({
            file: file.release.replace(/^[\\\/]/,''),
            hash: createHash(file.getContent())
        });

    });

    fis.util.map(ret.pkg, function (id, file) {
        var type = file.rExt.replace(".", ""),
            key = file.id,
            hash = file.getHash(),
            has = [];
        //支持编译有md5和没有md5参数两种情况
        var hashRelease = "";
        if (opt.md5 >= 1) {
            hashRelease = file.release.replace(file.ext, md5Connector + hash + file.ext);
        } else {
            hashRelease = file.release;
        }
        for (var tmpKey in ret.map.pkg) {
            var pkgInfo = ret.map.pkg[tmpKey];
            if (pkgInfo["uri"] == hashRelease) {
                has = pkgInfo["has"];
                //map.json增加hash和key项
                ret.map.pkg[tmpKey]["hash"] = hash;
                ret.map.pkg[tmpKey]["key"] = key;
                break;
            }
        }

        var hashList = [],
            contentList = {};
        for (var i = 0; i < has.length; i++) {
            if (ret.ids[has[i]]) {
                var fileHash = ret.ids[has[i]].getHash();
                hashList.push(fileHash);
                contentList[fileHash] = ret.ids[has[i]].getContent();
            }
        }
        fileArray.push({
            file: file.release.replace(/^[\\\/]/,''),
            hash: createHash(file.getContent())
        });

    });


    var hashMapFile = fis.file(root, (ns ? ns + "." : "") + (settings.manifest || 'hybrid.manifest.json'));

    hashMapFile.release = "/" + hashMapFile.subpath;
    hashMapFile.setContent(JSON.stringify(fileArray).replace(/},{/img, '},\r\n{'));
    //hashMapFile.setContent(util.inspect(ret));

    var timestamp = (function c(now) {
        now = new Date();
        return now.getFullYear() + '.' + (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '.' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate()) + '-' + (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + '.' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) + '.' + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds());
    })();

    var releaseFile = fis.file(root, (ns ? ns + "." : "") + (settings.release || 'release.json'));
    var releaseContent = settings.releaseContent || {};

    releaseContent = fis.util.merge({
        "release": timestamp
    }, releaseContent);

    releaseFile.release = "/" + releaseFile.subpath;
    releaseFile.setContent(JSON.stringify(releaseContent));

    ret.pkg[hashMapFile.subpath] = hashMapFile;
    ret.pkg[releaseFile.subpath] = releaseFile;

};


