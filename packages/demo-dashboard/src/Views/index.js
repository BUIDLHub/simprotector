// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";
// Import Main styles for this application
import "scss/style.scss";
import "react-toggle/style.css";
import "animate.css/animate.min.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import error from "Routes/error";
import MainRoute from "Routes/main";
import MfrRoute from "Routes/manufacturer";
import CoinbaseRoute from 'Routes/coinbase';
import PortalRoute from 'Routes/customerPortal';

import { default as initOps } from "Redux/init/operations";
import {default as conOps} from 'Redux/contract/operations';
import { Row, Col } from 'reactstrap';


import { tryCall } from "Utils";

import cn from "classnames";
import * as align from "Constants/alignments";

import Loading from "Components/Loading";

const DEF_START = "/main";

class AppStart extends Component {
  static getDerivedStateFromProps(props, state) {
    if (state.requestedInit) {
      return {};
    }

    setTimeout(() => tryCall(props.runInit), 10);
    return {
      requestedInit: true
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      requestedInit: false
    };
  }

  componentDidMount = () => {
    if (!this.state.requestedInit) {
      this.setState(
        {
          requestedInit: true
        },
        () => tryCall(this.props.runInit)
      );
    }
  };

  selectNetwork = e => {
    tryCall(this.props.changeNetwork(e.target.value-0));
  }

  render() {
    const { location, match, networkOptions, selectedNetwork } = this.props;
    if (location.pathname === "/") {
      return <Redirect to={DEF_START} />;
    }
   


    return (
      <div
        className={cn(
          "main-view-container",
          align.topCenter,
          align.full,
          align.noMarginPad
        )}
      >
        <Loading loading={this.props.showing} />
        <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
          <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
            <select type="select"  onChange={this.selectNetwork} >
              {
                networkOptions.map((o, i) => {
                  return (
                    <option value={o.value} selected={o.value === selectedNetwork}>{o.label}</option>
                  )
                })
              }
              </select>
          </Col>
        </Row>
        <Switch>
          <Route path={`${match.url}main`} component={MainRoute} />
          <Route path={`${match.url}coinbase`} component={CoinbaseRoute} />
          <Route path={`${match.url}customerPortal`} component={PortalRoute} />
          <Route path={`${match.url}manufacturer`} component={MfrRoute} />

          <Route path={`/error`} component={error} />
          <Redirect to="/error" />
        </Switch>
      </div>
    );
  }
}

const s2p = state => {
  let con = state.contract.instance;
  let prov = state.contract.provider;
  let idx = state.contract.availableProviders.indexOf(prov);
  let networkOptions = [{
    label: "Layer2--Rinkey",
    value: 0
  },{
    label: "Web3--Roptsten",
    value: 1
  }];

  return {
    loading: state.init.loading,
    selectedNetwork: idx,
    networkOptions
  };
};

const d2p = dispatch => {
  return {
    runInit: () => {
      dispatch(initOps.start());
    },
    changeNetwork: (id) => {
      dispatch(conOps.changeNetwork(id))
    }
  };
};

export default withRouter(connect(s2p, d2p)(AppStart));
