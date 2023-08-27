"use strict";

const chalk = require("chalk");
const gulp = require("gulp");
const path = require("path");
const zip = require("gulp-zip");
const fs = require("fs");
const Client = require("ssh2").Client;
const serveConfig = require("./deploy/config");
const appConfig = require("./config/utils/getProjectConfig")();

const conn = new Client();

const config = serveConfig();

const sshConfig = {
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
};

const NAME = config.projectName;
// 输出路径
const OUTPUT_PATH = config.context;
// 输出zip名
const OUTPUT_ZIPNAME = `${NAME}-${appConfig.version}.zip`;
// 输出zip路径
const OUTPUT_ZIP_PATH = path.join(OUTPUT_PATH, OUTPUT_ZIPNAME);
// 远程zip路径
const REMOTE_ZIP_PATH = `${config.remotePath}/${OUTPUT_ZIPNAME}`;
// 上传参数
const uploadParams = { file: OUTPUT_ZIP_PATH, target: REMOTE_ZIP_PATH };
// 中转缓存目录

const shellExecList = [`cd ${config.remoteWebPath}`, "exit"];

function Ready() {
  log("SSH: release Ready...");
  conn
    .on("ready", function() {
      log("SSH Client: ready success...");
      UploadFile(conn, uploadParams);
    })
    .connect(sshConfig);
}

/**
 * 上传文件
 * @param conn
 * @param uploadParams 上传参数
 * @class
 */
function UploadFile(conn, uploadParams) {
  const file = uploadParams.file;
  const target = uploadParams.target;
  if (!conn) {
    return;
  }
  conn.sftp(function(err, sftp) {
    if (err) {
      throw err;
    }
    const step = function() {};
    sftp.fastPut(file, target, { step }, function(err) {
      if (err) {
        // console.log(chalk.red(err.message));
        throw err;
      }
      log("Please wait while uploding...");
      Shell(conn);
    });
  });
}

function Shell(conn) {
  conn.shell(function(err, stream) {
    if (err) {
      throw err;
    }
    stream
      .on("close", function() {
        conn.end();
      })
      .on("data", function(data) {
        log("Stdout: " + data);
      });
    stream.end(shellExecList.map((shell) => shell + " \n").join(""));
  });
}

gulp.task("zip", function() {
  delZipPath();
  return gulp
    .src([`./dist/${appConfig.projectName}`])
    .pipe(zip(OUTPUT_ZIPNAME))
    .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task("connect", function(done) {
  Ready();
  done();
});

gulp.task("default", gulp.series(["zip", "connect"]));

function log(str) {
  // 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
  // console.log(`\u001b[32m ${str} \u001b[32m`);
  console.log(chalk.green(str));
}

function delZipPath() {
  try {
    fs.unlinkSync(OUTPUT_ZIP_PATH);
  } catch (e) {
    console.log(`没有上传文件：${OUTPUT_ZIP_PATH}`);
  }
}
