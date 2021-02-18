import React from "react"
import Lolly from "../Components/Lolly"
import "../Components/Result.css"
import 'bootstrap/dist/css/bootstrap.min.css';

function Template({ pageContext}) {
    return (
        <div> 
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-5 text-right created-lolly-container ">
                        <Lolly top={pageContext.d.c1} middle={pageContext.d.c2} bottom={pageContext.d.c3} />
                    </div>
                    <div className="col-lg-6 created-lolly-details-div">
                        <div className="lolly-details">
                             {/* {path} */}
                            <span><h2>{pageContext.d.rec}</h2></span>

                            <span><h2>{pageContext.d.message}</h2></span>

                            <span><h2>___{pageContext.d.sender}</h2></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Template

// import React from "react";

// export default ({pageContext}) => {
//   return (
//     <div>
//       <div>This page is create dynamically at Build Time</div>
//       <h1>{pageContext.d.c1}</h1>
//       {/* <h1>{pageContext.c2}</h1> */}
//       {/* <h1>{pageContext.c3}</h1> */}
//     </div>
//   )
// }