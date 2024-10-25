import { ethers } from "ethers";
import { useState } from "react";

export default function App() { return <><Header /><Tools /></> }

const Header = () => <h1>hardened tomb ethereum tools</h1>;
const Tools = () => <ul>{Object.entries(tools).map(([name, [defs, func]]) => <li key={name}><Tool name={name} defs={defs} func={func} /></li>)}</ul>

const Tool = ({ name, func, defs }: { name: string, func: (args: { [key: string]: string }) => string, defs: { [key: string]: string } }) => (([args, ARGS]) => (expr => <code><b>{name}</b> <Inputs cb={(k, v) => { ARGS({ ...args, [k]: v }) }} defs={defs} /><pre>{expr}</pre><button onClick={() => navigator.clipboard.writeText(expr)}>copy</button></code>)(func(args)))(useState(defs));
const Inputs = ({ defs, cb }: { defs: { [key: string]: string }, cb: (k: string, v: string) => void }) => <>{Object.entries(defs).map(([k, v]) => <span key={k}>{k}=<input placeholder={v} onChange={e => cb(k, e.target.value ? e.target.value : v)} /> </span>)}</>;
const evaluate = (f: () => string) => { try { return `${f()}` } catch (e) { return `# ${e}` } }

const tools: { [key: string]: [{ [key: string]: string }, (args: { [key: string]: string }) => string] } = {
  command_generate_account: [{ name: 'account' }, args => `head -c 32 /dev/urandom | xxd -p -c 32 | HT_FMT=hex ht addk ${args.name.replace(/[^a-zA-Z0-9/]/g, '_')}`],
  command_get_public_key: [{ name: 'account' }, args => `HT_FMT=pub HT_CRV=k256 HT_PUB=raw ht getk ${args.name.replace(/[^a-zA-Z0-9/]/g, '_')} | xxd -p -c 64 | sed 's/^/0x04/'`],
  function_compute_address: [{ public_key: `` }, args => `${evaluate(() => ethers.computeAddress(args.public_key))}`],
}