import cn from "classnames";
import * as align from "Constants/alignments";
import { Row, Col, CardText, FormGroup } from "reactstrap";
import React from "react";
// import InputField from "Components/Card/Input";
import Button from "Components/Button/Progress";
import { Icon } from "Components/icons";
import InputField from "Components/Card/Input";

export default class Step4 extends React.Component {
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
            className={cn(align.allCenter, "py-3", align.noMarginPad)}
          >
            <span className={cn("font-weight-bold", "text-dark", "text-1-5")}>
              Verify your Number
            </span>
          </Col>
        </Row>

        <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
          <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
            <InputField placeholder="###-###-####" />
          </Col>
        </Row>

        <Row
          className={cn(align.full, align.noMarginPad, align.allCenter, "mt-4")}
        >
          <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
            <Button>Confirm</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
