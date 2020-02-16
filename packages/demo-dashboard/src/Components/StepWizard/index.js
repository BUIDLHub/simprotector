import cn from "classnames";
import * as align from "Constants/alignments";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from "reactstrap";
import { tryCall } from "Utils";
import React, { Component } from "react";
import ButtonProgress from "Components/Button/Progress";
import ButtonPrevious from "Components/Button/Previous";

import StepIndicator from "./StepIndicatorContainer";
import StepWizard from "react-step-wizard";


/**
 * Turns child elements into an animated set of steps
 */
export default class StepWizardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      childCount: React.Children.toArray(props.children).length
    };
    this.wizardRef = React.createRef();
  }

  next = async () => {
    await tryCall(this.props.onNext, this.state.page);

    let n = this.state.page + 1;
    
    console.log("N", n, "count", this.state.childCount);
    
    if (n >= this.state.childCount) {
      n = this.state.childCount - 1;
    }

    if (this.wizardRef.current.nextStep) {
      this.wizardRef.current.nextStep();
      this.setState({
        page: n
      });
    }
  };

  prev = () => {
    let n = this.state.page - 1;
    if (n < 0) {
      n = 0;
    }

    if (this.wizardRef.current.previousStep) {
      this.wizardRef.current.previousStep();
      this.setState({
        page: n
      });
    }
  };

  toStep = idx => {
    
    if(this.wizardRef.current.goToStep) {
      this.wizardRef.current.goToStep(idx+1);
      this.setState({
        page: idx
      })
    } 
  }

  render() {
    let { stepMeta, noButtons, lightIndicator, noIndicator } = this.props;
    if(!stepMeta) {
      stepMeta = [];
    }

    let page = this.state.page;
    let meta = stepMeta[page] || {};
    let dirty = meta.dirty;
    let nextTitle = meta.nextTitle;
    let hasNext = page < stepMeta.length - 1 && !dirty;
    let hasPrev = page > 0;

    let children = React.Children.toArray(this.props.children);
    
    return (
      <div className={cn(align.full, align.topCenter, align.noMarginPad)}>
        
        <Card className={cn("step-card", align.full, align.noMarginPad)}>
          <CardBody className={cn("step-body", align.full, align.noMarginPad)}>
            <StepWizard ref={this.wizardRef}>{this.props.children}</StepWizard>
          </CardBody>

          {!noButtons && (
            <CardFooter
              className={cn(align.full, align.rightCenter, align.noMarginPad)}
            >
              <Row
                className={cn(align.full, align.noMarginPad, align.allCenter)}
              >
                <Col xs="6" className={cn(align.leftCenter, align.noMarginPad)}>
                  <ButtonPrevious
                    size="sm"
                    color={hasPrev ? "primary" : "secondary"}
                    onClick={this.prev}
                    disabled={!hasPrev}
                  >
                    Prev
                  </ButtonPrevious>
                </Col>

                <Col
                  xs="6"
                  className={cn(align.rightCenter, align.noMarginPad)}
                >
                  <ButtonProgress onClick={this.next} disabled={!hasNext}>
                    {nextTitle || "Next"}
                  </ButtonProgress>
                </Col>
              </Row>
            </CardFooter>
          )}
        </Card>
        {
          !noIndicator &&
          <Row className={cn(align.full, "py-4", align.noMarginPad, align.allCenter)}>
                <StepIndicator light={lightIndicator} 
                              stepCount={children.length} 
                              stepNumber={page} 
                              goToStep={this.toStep} />
          </Row>
        }
      </div>
    );
  }
}

// CARD HEADER

// <CardHeader className={cn(align.full, "step-header", "card-header")}>
//   <div className={cn(align.full, align.leftCenter, align.noMarginPad)}>
//     <span className={cn("font-weight-bold", "text-1")}>
//       {/* {meta.title} */}
//       {this.props.header}
//     </span>
//   </div>
// </CardHeader>;
