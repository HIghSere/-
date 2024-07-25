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
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
//import functions files
const sleep_1 = require("./util/sleep");
const layer4_1 = require("./layer4");
const layer7_1 = require("./layer7");
//colors
const lightCyan = '\x1b[38;5;87m';
const white = `\u001b[0m`;
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`
 _____  _                     _  _              ____            
|_   _|| |_  ___  ___  ___  _| ||_| ___  ___   |    \  ___  ___ 
  | |  |   ||  _|| -_|| .'|| . || ||   || . |  |  |  || . ||_ -|
  |_|  |_|_||_|  |___||__,||___||_||_|_||_  |  |____/ |___||___|
                                        |___|                   
`);
        console.log(`
    [1] Layer4 [2] Layer7
`);
        const select = prompt(`${lightCyan}select${white}> `);
        switch (select) {
            //layer4
            case "1":
                (0, layer4_1.layer4)();
                break;
            //layer7
            case "2":
                (0, layer7_1.layer7)();
                break;
            //default
            default:
                console.log("指定された項目が存在しません。");
                yield (0, sleep_1.sleep)(3000);
                break;
        }
    });
}
