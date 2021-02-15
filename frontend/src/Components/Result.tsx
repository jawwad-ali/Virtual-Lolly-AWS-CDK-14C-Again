import React from "react"
import Lolly from "./Lolly"
import "./Result.css"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Result({ c1, c2, c3, senderRef, messageRef, recRef, path }) {
    console.log(c1, c2, c3, senderRef, messageRef, recRef, path)
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-5 text-right created-lolly-container ">
                        <Lolly top={c1} middle={c2} bottom={c3} />
                    </div>
                    <div className="col-lg-6 created-lolly-details-div">
                        <h4 className="dynamic-lolly-path">{`d3ea7zhqowj1ko.cloudfront.net/lolly/${path}`}</h4>
                        <div className="lolly-details">
                            <span><h2>{recRef}</h2></span>

                            <span><h2>{messageRef}</h2></span>

                            <span><h2>___{senderRef}</h2></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}