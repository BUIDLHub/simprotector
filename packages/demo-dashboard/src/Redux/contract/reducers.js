import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
    loading: false,
    instance: null,
    provider: null,
    availableContracts: [],
    availableProviders: [],
    receipt: null,
    recentEvents: [],
    abi: []
}

const start = (state=INIT) => {
    return {
        ...state,
        loading: true
    }
}

const success = (state=INIT, action) => {
    let cons = action.contract.contracts;
    let provs = action.contract.providers;

    return {
        ...state,
        instance: cons[0],
        provider: provs[0],
        abi: action.contract.abi,
        availableContracts: cons,
        availableProviders: provs,
        loading: false
    }
}

const working = (state=INIT, action) => {
    return {
        ...state,
        loading: action.busy
    }
}

const last = (state=INIT, action) => {
    return {
        ...state,
        lastReceipt: action.receipt
    }
}

const change = (state=INIT, action) => {
    return {
        ...state,
        instance: action.contract,
        provider: action.provider
    }
}

const HANDLERS = {
    [Types.INIT_START]: start,
    [Types.LAST_RECEIPT]: last,
    [Types.INIT_SUCCESS]: success,
    [Types.CHANGE_NETWORK]: change,
    [Types.WORKING]: working
}
  
  export default createReducer(INIT, HANDLERS);