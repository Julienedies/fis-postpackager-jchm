fis-postpackager-jchm
=====

自用fis插件，可以在部署根目录生成hybrid.manifest.json和release.json两个文件。用于cordova hybrid app项目web内容增量更新使用。

##安装
```
npm install -g fis-postpackager-jchm
```

##fis-confi.js
```
fis.config.set('modules.postpackager', 'jchm');
```

##jchm_cli
除了通过fis插件使用外，可以通过命令行运行 ```jchm_cli``` 使用。该命令会在当前目录下查找www目录，然后在www根目录下生成hybrid.manifest.json和release.json两个文件。

