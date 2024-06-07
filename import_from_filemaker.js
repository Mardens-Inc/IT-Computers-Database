import Filemaker from "./Filemaker.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const filemaker = new Filemaker("https://lib.mardens.com/fmutil", "admin", "19MRCC77!", "IT Master Computer database", "IT Master Computer database");
console.log((await filemaker.getRows()))