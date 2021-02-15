import React, { useState, useRef } from "react"
import Lolly from "../Components/Lolly"
import Heading from "../Components/Heading"
import "./CreateLolly.css"
import { Link } from "gatsby"
import { Grid } from "@material-ui/core"
import * as yup from 'yup';
import { useFormik } from 'formik';
import { createLolly } from "../graphql/mutations"
import { API } from "aws-amplify"
import { randomBytes } from "crypto"
import Result from "../Components/Result"

export default function CreateLolly() {

    const [c1, setC1] = useState("#d52358")
    const [c2, setC2] = useState("#e95946")
    const [c3, setC3] = useState("#daea43")
    const recRef = useRef<any>("")
    const senderRef = useRef<any>("")
    const messageRef = useRef<any>("")
    const [path, setPath] = useState("")

    // FORMIK
    const formik = useFormik({
        initialValues: {
            rec: "",
            message: "",
            sender: "",
        },
        onSubmit: (values) => {
            console.log(values)
        },
        validationSchema: yup.object({
            rec: yup.string().required("This field is required"),
            message: yup.string().required("This field is required"),
            sender: yup.string().required("This field is required"),
        })
    })

    const handleFire = async () => {

        if (!recRef || !messageRef || !senderRef) {
            return false
        }

        const getpath = randomBytes(5).toString("hex")
        setPath(getpath)
        try {
            const vlolly = {
                c1,
                c2,
                c3,
                sender: senderRef.current.value,
                rec: recRef.current.value,
                message: messageRef.current.value,
                path: getpath
            }

            await API.graphql({
                query: createLolly,
                variables: {
                    vlolly: vlolly
                }
            })
        }
        catch (err) {
            console.log
        }
    }

    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <Link to="/">
                    <Heading />
                </Link>
            </div>
            <div className="data-container">
                {
                    !path ?
                        (
                            <Grid container spacing={3}>
                                <>
                                    <Grid item lg={6} xs={12}>
                                        <div className="lollyContainer">
                                            <Lolly top={c1} middle={c2} bottom={c3} />
                                            <div className="colorInputs">
                                                <label className="colorPickerLabel">
                                                    <input type="color" className="colorPicker" value={c1}
                                                        onChange={(e) => setC1(e.target.value)}
                                                    />
                                                </label>
                                                <label className="colorPickerLabel">
                                                    <input type="color" className="colorPicker" value={c2}
                                                        onChange={(e) => setC2(e.target.value)}
                                                    />
                                                </label>
                                                <label className="colorPickerLabel">
                                                    <input type="color" className="colorPicker" value={c3}
                                                        onChange={(e) => setC3(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} xs={5}>
                                        <div className="form-container">
                                            <form onSubmit={formik.handleSubmit}>
                                                <label htmlFor="to">To:</label>
                                                <input ref={recRef} autoComplete="off" className="form-control text-white text-field" type="text" id="rec"
                                                />
                                                {formik.errors.rec ? <div className="error">{formik.errors.rec}</div> : null}

                                                <br />

                                                <label htmlFor="Say Something nice">Say Something nice:</label>
                                                <textarea autoComplete="off" className="form-control text-field text-white" id="message"
                                                    ref={messageRef}></textarea>
                                                {formik.errors.message ? <div className="error">{formik.errors.message}</div> : null}

                                                <br />

                                                <label htmlFor="From">From:</label>
                                                <input autoComplete="off" className="form-control text-field text-white" id="sender" type="text"
                                                    ref={senderRef} />
                                                <br /><br />
                                                {formik.errors.sender ? <div className="error" >{formik.errors.sender}</div> : null}

                                                <input type="submit" className="btn btn-dark" onClick={() => handleFire()} id="login" value="Freez" />
                                            </form>
                                        </div>
                                    </Grid>
                                </>
                            </Grid>
                        ) : (
                            <Result
                                c1={c1}
                                c2={c2}
                                c3={c3}
                                recRef={recRef.current.value}
                                messageRef={messageRef.current.value}
                                senderRef={senderRef.current.value}
                                path={path}
                            />
                        )
                }
            </div>
        </div >
    )
}