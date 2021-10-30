/*
Logger class for easy and aesthetically pleasing console logging 
*/
const { cyan, red, magenta, gray, yellow, white, green } = require("colorette");
const { Timestamp } = require("@sapphire/time-utilities");
const log4js = require("log4js");
log4js.configure({
  appenders: { logs: { type: "file", filename: "cocktailbot.log" } },
  categories: { default: { appenders: ["logs"], level: "log" } }
});
const filelogger = log4js.getLogger("logs");

exports.log = (content, type = "log") => {
  const timestamp = `[${cyan(new Timestamp("YYYY-MM-DD HH:mm:ss"))}]:`;
  
  switch (type) {
    case "log": return console.log(`${timestamp} ${gray(type.toUpperCase())} ${content} `); filelogger.info(content);
    case "warn": return console.log(`${timestamp} ${yellow(type.toUpperCase())} ${content} `); filelogger.warn(content);
    case "error": return console.log(`${timestamp} ${red(type.toUpperCase())} ${content} `); filelogger.error(content);
    case "debug": return console.log(`${timestamp} ${magenta(type.toUpperCase())} ${content} `); filelogger.debug(content);
    case "cmd": return console.log(`${timestamp} ${white(type.toUpperCase())} ${content}`); filelogger.info(content);
    case "ready": return console.log(`${timestamp} ${green(type.toUpperCase())} ${content}`); filelogger.info(content);
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
