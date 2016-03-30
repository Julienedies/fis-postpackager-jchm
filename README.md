fis-postpackager-jchm
=====

自用fis插件，可以在部署根目录生成hybrid.manifest.json和release.json两个文件。供cordova hybrid app项目web内容增量更新使用。

##安装
```
npm install -g fis-postpackager-jchm
```

##fis-confi.js
```
fis.config.set('modules.postpackager', 'jchm');
fis.config.merge({settings: {
    postpackager: {
        jchm: {
            release: 'release.json', //自定义release文件名，默认为release.json；
            manifest: 'manifest',//自定义manifest文件名，默认为ybrid.manifest.json；
            releaseContent: {version: '1.2'} //自定义release.json中的字段，譬如版本号
        }}
}});
```

##jchm_cli
除了通过fis插件使用外，可以通过命令行运行 ```jchm_cli``` 使用。该命令会在当前目录下查找www目录，然后在www根目录下生成hybrid.manifest.json和release.json两个文件。
使用```jchm_cli -h```查看选项
