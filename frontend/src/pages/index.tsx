import React from "react"
import Heading from "../Components/Heading"
import Lolly from "../Components/Lolly"
import "./style.css"
import { Link } from "gatsby"
import Button from "../Components/Button"

export default function Home() {
  return (
    <div className="homepage-container">
      <div>
        <Heading />
      </div>
      <div className="displaylolly-container">
        <Lolly
          top={"#C22671"} middle={"#D92A3A"} bottom={"#D51020"}
        />
        <Lolly
          top={"#97e665"} middle={"#8ccb4c"} bottom={"#a8d838"}
        />
        <Lolly
          top={"#cd2753"} middle={"#d5cfd1"} bottom={"#5ba3da"}
        />
        <Lolly
          top={"#feefd6"} middle={"#b65ae4"} bottom={"#c116c1"}
        />
        <Lolly
          top={"#ed265b"} middle={"#f77249"} bottom={"#a8d838"}
        />
      </div>
      <div className="homebtn-div">
        <Link to="/CreateLolly">
          <Button />
        </Link>
      </div>
    </div>
  )
}
