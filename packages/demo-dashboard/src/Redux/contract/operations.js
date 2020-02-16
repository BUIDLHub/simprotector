import { Creators } from "./actions";
import { default as toastr } from "Redux/toastr/operations";
import abi from "Constants/abi/SimProtector.json";
import { ethers } from "ethers";
import { ArbProvider } from "arb-provider-ethers";

// const ADDR = "0xebb10aadcfe3903a474dda106cffa597794b7a66"; // full rinkeby
const ADDR = "0x895521964D724c8362A36608AAf09A3D7d0A0445"; // arbitrum
// const ADDR = "0xdd03704a1d8540b12889a7837161127632c21c14"; // rollup

const ADDR_ROPSTEN = "0xAA92f0E922ea64912DE454048deF8D3274260f47"; // arbitrum
const ROPSTEN_WEB3_ENDPOINT = 'https://ropsten.infura.io/v3/858e36827c5143c4b150988e2d1a7145';
const ROPSTEN_WEB3_PRIVATE_KEY = '0xe010aC6e0248790e08F42d5F697160DEDf97E024';


const initRopsten = () => async dispatch => {
  const resultRopsten = initRopsten()(dispatch);
  const resultRinkeby = initRinkeby()(dispatch);
  const ropsten = await resultRopsten;
  const rinkeby = await resultRinkeby;
  dispatch(Creators.initSuccess({
    contract: rinkeby.con,
    contractRopsten: ropsten.conRopsten,
    provider: rinkeby.provider,
    events: rinkeby.events,
    abi: rinkeby.abi.abi
  }));

  return resultRinkeby;
});

const initRopsten = () => async dispatch => {
  try {
    let providerRopsten = new Web3Provider(ROPSTEN_WEB3_ENDPOINT);
    // const accounts = await window.ethereum.enable();
    const signerRopsten = new ethers.Wallet(ROPSTEN_WEB3_PRIVATE_KEY);
    let conRopsten = new EtherscanProvider.Contract(ADDR_ROPSTEN, abi.abi, signerRopsten);

    let web3ProviderRopsten = new ethers.getDefaultProvider("ropsten");
    let blockRopsten = await providerRopsten.getBlockNumber();
    
    if (blockRopsten.toString) {
      blockRopsten = blockRopsten.toString() - 0;
    }
    blockRopsten -= 1000;
    console.log("Ropsten: Start block", blockRopsten);


    //let con = new ethers.Contract(ROPSTEN_ADDR, abi.abi, provider.getSigner());
    let ifc = new ethers.utils.Interface(abi.abi);

    let evtDefs = ifc.events;
    let regTopic = evtDefs.RegisterPhoneNumber.topic;
    console.log("TOPIC", regTopic);

    let getLogsPromiseRopsten = web3ProviderRopsten.getLogs({
      address: ADDR_ROPSTEN,
      fromBlock: blockRopsten,
      topics: [regTopic]
    });

    let eventsRopsten = await getLogsPromiseRopsten;
    
    console.log("Ropsten: EVENTS", eventsRopsten);
    eventsRopsten = eventsRopsten.map(e => {
      let ev = ifc.parseLog(e);
      let num = ev.values.phoneNumber.toString();
      let time = ev.values.timestamp.toString() - 0;
      let owner = ev.values.ownerAddress.toString();
      return {
        phoneNumber: num,
        timestamp: time * 1000,
        owner
      }
    });
    eventsRopsten.sort((a, b) => b.timestamp - a.timestamp);

  } catch (e) {
    console.log("Ropsten: ${e}");
  }
};

const initRinkeby = () => async dispatch => {
  try {
    dispatch(Creators.initStart());

    let provider = new ArbProvider(
      "http://104.248.9.236:1235",
      new ethers.providers.Web3Provider(window.ethereum)
    );

    const accounts = await window.ethereum.enable();

    const signer = provider.getSigner()
    let con = new ethers.Contract(ADDR, abi.abi, signer);

    let web3Provider = new ethers.getDefaultProvider("rinkeby");

    let block = await provider.getBlockNumber();

    if (block.toString) {
      block = block.toString() - 0;
    }
    block -= 1000;
    console.log("Rinkeby: Start block", block);
    
    //let con = new ethers.Contract(ROPSTEN_ADDR, abi.abi, provider.getSigner());
    let ifc = new ethers.utils.Interface(abi.abi);

    let evtDefs = ifc.events;
    let regTopic = evtDefs.RegisterPhoneNumber.topic;
    console.log("Rinkeby: TOPIC", regTopic);


    let getLogsPromiseRinkeby = web3Provider.getLogs({
      address: ADDR,
      fromBlock: block,
      topics: [regTopic]
    });

    let events = await getLogsPromiseRinkeby;
    console.log("Rinkeby: EVENTS", events);
    
    events = events.map(e => {
      let ev = ifc.parseLog(e);
      let num = ev.values.phoneNumber.toString();
      let time = ev.values.timestamp.toString() - 0;
      let owner = ev.values.ownerAddress.toString();
      return {
        phoneNumber: num,
        timestamp: time * 1000,
        owner
      }
    });
    events.sort((a, b) => b.timestamp - a.timestamp);

    dispatch(Creators.initSuccess({
      contract: con,
      provider: provider,
      events,
      abi: abi.abi
    }));

  } catch (e) {
    console.log("Rinkeby: ${e}");
  }
};

const addProvider = address => async (dispatch, getState) => {
  const resultRinkeby = addProviderRinkeby(address)(dispatch, getState);
  const resultRopsten = addProviderRopsten(address)(dispatch, getState);
  await resultRopsten;
  return resultRinkeby;
};

const addProviderRopsten = address => async (dispatch, getState) => {
  try {
    // dispatch(Creators.working(true));
    const contr = await getState().contractRopsten.instance;
    await contr["addProvider(address)"](address);
    console.log('Ropsten: done')
  } catch (e) {
    console.log('Ropsten: add provider err', e);
    // dispatch(toastr.error("Problem adding provider"));
  }
};


const addProviderRinkeby = address => async (dispatch, getState) => {
  try {
    dispatch(Creators.working(true));
    const contr = await getState().contract.instance;
    await contr["addProvider(address)"](address);
    console.log('Rinkeby: done')
  } catch (e) {
    console.log('Rinkeby: add provider err', e);
    dispatch(toastr.error("Problem adding provider"));
  }
};


const registerPhoneNumber = (phoneNumber, numberOwner) => async (
  dispatch, getState) => {
  const resultRopsten = registerPhoneNumberRopsten(phoneNumber, numberOwner)(dispatch, getState);
  const resultRinkeby = registerPhoneNumberRinkeby(phoneNumber, numberOwner)(dispatch, getState);
  await resultRopsten;
  return resultRinkeby;
}


const registerPhoneNumberRopsten = (phoneNumber, numberOwner) => async (
  dispatch,
  getState
) => {
  try {
    //dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    const contr = await getState().contractRopsten.instance;
    let txn = await contr.functions.registerPhoneNumber(hashed, numberOwner);
    const r = await txn.wait();
    if (r) {
      let evts = r.events || [];
      let evt = evts[0];
      if (evt) {
        let vals = evt.args;
        if (vals) {
          // let pn = vals.phoneNumber.toString();
          // let timestamp = (vals.timestamp.toString()-0)*1000;
          // let ownerAddress = (vals.ownerAddress.toString());
          // dispatch(Creators.lastReceipt({
          //   phoneNumber: pn,
          //   timestamp,
          //   ownerAddress
          // }));
        }
      }
    }

  } catch (e) {
    console.log(`Ropsten: ${e}`);
    //dispatch(toastr.error("problem register number"));
  }
};

const registerPhoneNumberRinkeby = (phoneNumber, numberOwner) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    const contr = await getState().contract.instance;
    let txn = await contr.functions.registerPhoneNumber(hashed, numberOwner);
    const r = await txn.wait();
    if (r) {
      let evts = r.events || [];
      let evt = evts[0];
      if (evt) {
        let vals = evt.args;
        if (vals) {
          let pn = vals.phoneNumber.toString();
          let timestamp = (vals.timestamp.toString() - 0) * 1000;
          let ownerAddress = (vals.ownerAddress.toString());
          dispatch(Creators.lastReceipt({
            phoneNumber: pn,
            timestamp,
            ownerAddress
          }));
        }
      }
    }

  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem register number"));
  }
};


const confirmShutdown = phoneNumber => async (dispatch, getState) => {
  const ropstenResult = confirmShutdownRopsten(phoneNumber)(dispatch, getState);
  const rinkebyResult = confirmShutdownRinkeby(phoneNumber)(dispatch, getState);

  await ropstenResult;
  return rinkebyResult;
};

const confirmShutdownRinkeby = phoneNumber => async (dispatch, getState) => {
  try {
    dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    let txn = await getState().contract.instance.functions.confirmShutdown(hashed);
    const r = await txn.wait();
    console.log("Receipt", r);
    return r;
  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem register number"));
  }
};


const confirmShutdownRopsten = phoneNumber => async (dispatch, getState) => {
  try {
    //dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    let txn = await getState().contractRopsten.instance.functions.confirmShutdown(hashed);
    const r = await txn.wait();
    console.log("Ropsten: Receipt", r);
    return r;
  } catch (e) {
    console.log(`Ropsten error: ${e}`);
    //dispatch(toastr.error("problem register number"));
  }
};

const registerSimChange = phoneNumber => async (dispatch, getState) => {
  try {
  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem registering sim change"));
  }
};

export default {
  init,
  addProvider,
  registerPhoneNumber,
  confirmShutdown,
  registerSimChange
};
