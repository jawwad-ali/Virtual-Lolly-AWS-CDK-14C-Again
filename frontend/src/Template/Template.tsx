import React from "react"
import Lolly from "../Components/Lolly"
import "../Components/Result.css"
import 'bootstrap/dist/css/bootstrap.min.css';

function Template({ pageContext: { c1, c2, c3, rec, sender, message, path } }) {
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-5 text-right created-lolly-container ">
                        <Lolly top={c1} middle={c2} bottom={c3} />
                    </div>
                    <div className="col-lg-6 created-lolly-details-div">
                        <div className="lolly-details">
                            {path}
                            <span><h2>{rec}</h2></span>

                            <span><h2>{message}</h2></span>

                            <span><h2>___{sender}</h2></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Template