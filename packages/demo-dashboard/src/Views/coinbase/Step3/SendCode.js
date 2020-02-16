import cn from 'classnames';
import * as align from 'Constants/alignments';
import { Row, Col, CardHeader, Button  } from 'reactstrap';
import React, { Component } from 'react'
import {tryCall} from "Utils";
import Loading from 'Components/Loading';

export default class SendCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    sendCode = () => {
        this.setState({
            loading: true
        }, async () => {
            await tryCall(this.props.sendText, "284-871");
            this.setState({
                loading: false
            }, () => {
                tryCall(this.props.onClick);
            })
        })
    }

    render() {
        
        return (
            <div className={cn( align.full, align.topCenter, align.noMarginPad)}>
                
                <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
                    <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
                        <CardHeader color="secondary" className={cn(align.full, "py-3")}>
                            SMS Sent
                        </CardHeader>
                    </Col>
                </Row>
                <div className={cn("step", align.full, "py-5",align.topCenter, align.noMarginPad)}>
                    <Loading loading={this.state.loading} />

                    <Row className={cn("step", align.full, align.noMarginPad, align.allCenter)}>
                        <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
                            <span className={cn('font-weight-light', 'text-1')}>
                                SMS message has been sent with a verification code.
                            </span>
                        </Col>
                    </Row>

                    <Row className={cn(align.full, align.noMarginPad, align.allCenter)}>
                        <Col xs="12" className={cn(align.allCenter, align.noMarginPad)}>
                            <Button size="lg" color="primary"
                                    onClick={this.sendCode}>Next</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
