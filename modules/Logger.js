/*
Logger class for easy and aesthetically pleasing console logging 
*/
const { cyan, red, magenta, gray, yellow, white, green } = require("colorette");
const { Timestamp } = require("@sapphire/time-utilities");
const log4js = require("log4js");

log4js.configure({
  appenders: { 
    out: { type: 'stdout', layout: { type: 'messagePassThrough' }},
    logs: { type: "file", filename: "./logs/logs.log", maxLogSize: 10485760, backups: 5, compress: true, layout: { type: 'messagePassThrough' }} 
  },
  categories: { 
    default: { appenders: [ 'logs', 'out' ], level: "debug" } 
  }
});

const filelogger = log4js.getLogger("logs");

exports.log = (content, type = "log") => {
  const timestamp = `[${cyan(new Timestamp("YYYY-MM-DD HH:mm:ss"))}]:`;
  
  switch (type) {
    case "log": return filelogger.debug(`${timestamp} ${yellow(type.toUpperCase())} ${content} `);
    case "warn": return filelogger.debug(`${timestamp} ${yellow(type.toUpperCase())} ${content} `);
    case "error": return filelogger.debug(`${timestamp} ${red(type.toUpperCase())} ${content} `);
    case "debug": return filelogger.debug(`${timestamp} ${magenta(type.toUpperCase())} ${content} `);
    case "cmd": return filelogger.debug(`${timestamp} ${white(type.toUpperCase())} ${content}`);
    case "ready": return filelogger.debug(`${timestamp} ${green(type.toUpperCase())} ${content}`);
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
