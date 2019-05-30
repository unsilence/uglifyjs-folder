// var fs = require('fs');
var path = require('path');
const fs = require('fs-extra')
var spawn = require('child_process').spawn;


function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList);  //递归读取文件
        } else {
            // console.log(fullPath)
            fs.emptyDir(path.resolve(dir, '..') + path.sep + 'mini', err => {
                if (err) return console.error(err)
                let nodeSpawn = spawn('uglifyjs', [fullPath, '-c', '-m', '-o', path.resolve(dir, '..') + path.sep + 'mini' + path.sep + item]);

                nodeSpawn.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });

                nodeSpawn.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });

                nodeSpawn.on('close', (code) => {
                    console.log(`子进程退出码：${code}`);
                });
            })


            filesList.push(fullPath);
        }
    });
    return filesList;
}

var filesList = [];

readFileList(__dirname + '/js', filesList);

