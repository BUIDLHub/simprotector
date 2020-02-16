import cn from "classnames";
import * as align from "Constants/alignments";
import { Row, Col, CardText, FormGroup } from "reactstrap";
import React from "react";
// import InputField from "Components/Card/Input";
import Button from "Components/Button/Coinbase";
import { Icon } from "Components/icons";

export default class Step6 extends React.Component {
  render() {
    return (
      <div
        className={cn(
          "step",
          "step3",
          align.full,
          align.topCenter,
          align.noMarginPad
        )}
      >
        <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
          <Col
            xs="12"
            className={cn(
              align.allCenter,
              "py-3",
              align.noMarginPad,
              "py-4",
              "px-3",
              "bg-success"
            )}
          >
            <span className={cn("font-weight-bold", "text-light", "text-1-5")}>
              Success
            </span>
          </Col>
        </Row>

        <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
          <Col xs="10" className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("font-weight-light", "text-1, 'my-2")}>
              Password Reset
            </span>
          </Col>
        </Row>

        <Row
          className={cn(align.full, align.noMarginPad, align.allCenter, "my-4")}
        >
          <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
            <Button>Confirm</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
