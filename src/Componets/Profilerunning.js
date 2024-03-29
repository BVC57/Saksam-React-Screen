import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "./Main.css";
import Score from "./Score";

const App = (Newdata) => {
  const TotalScore = 1000;
  const { userId, authToken } = Newdata;
  // console.log('userId for profile', userId);
  // console.log('authToken: profile', authToken);
  // State variables to manage loading, error, and API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [ProfileImagesrc, setProfileImagesrc] = useState("");
  const [aadharImageSrc, setAadharImageSrc] = useState(""); //set for update the image path
  const [panImageSrc, setpanImageSrc] = useState("");
  const [DLImagesrc, setDLImagesrc] = useState("");
  // const [ECImagesrc, setECImagesrc] = useState("");
  // const [EHImagesrc, setEHImagesrc] = useState("");
  // const [EQImagesrc, setEQImagesrc] = useState("");
  // const [DSImagesrc, setDSImagesrc] = useState("");
  const [aadharDataPresent, setAadharDataPresent] = useState(false); // set for Aadhar card visibility
  const [panDataPresent, setpanDataPresent] = useState(false); // set for Pan card visibility
  const [dlDataPresent, setdlDataPresent] = useState(false); // set for driving licence visibility
  // const [ecDataPresent, setecDataPresent] = useState(false); // set for eduction certificate visibility
  // const [ehDataPresent, setehDataPresent] = useState(false); // set for employment history visibility
  // const [dsDataPresent, setdsDataPresent] = useState(false); // set for digital sign visibility
  const [eqDataPresent, seteqDataPresent] = useState(false); // set for eduction qulification visibility
  const [addDataPresent, setaddDataPresent] = useState(false); // set for eduction qulification visibility
  const [username, setUsername] = useState(""); // State variable to store username

  // useEffect to make the API call when the component mounts

  useEffect(() => {
    const makeAPICall = async () => {
      if (authToken === undefined) {
        setError("Token Not Found");
      } else {
        setLoading(true);
        try {
          const response = await fetch(
            `https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/get_viewer_attribute_list?id=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();

          if (result.Status_Code === 200) {
            setData(result);
            setLoading(false);
          } else {
            console.error("API call failed with status:", result.message);
            setLoading(false);
            setError(true);
          }
        } catch (error) {
          console.error("Error fetching data from API:", error);
          setLoading(false);
          setError(true);
        }
      }
    };

    makeAPICall();
  }, [userId, authToken]);

  useEffect(() => {
    if (data) {
      setDataLabels(data);
      setUsername(data.p_info?.fullname || "");
    }
  }, [data]);

  // Function to set label data based on the API response
  const setDataLabels = (data) => {
    if (
      data !== null &&
      data !== undefined &&
      data.data !== null &&
      data.data !== undefined
    ) {
      // Set personal information //
      setUsername(data.data.p_info.fullname);
      setLabelData("full-name-label", data.data.p_info.fullname || "-");
      setLabelData("date-of-birth-label", data.data.p_info.dob || "-");
      setLabelData("gender-label", data.data.p_info.gender || "-");
      setLabelData("fname-label", data.data.p_info.fathername || "-");
      setLabelData("contact-Phone-label", data.data.p_info.phonenumber || "-");
      setLabelData("contact-Email-label", data.data.p_info.mail || "-");
      // Set Profile Image image
      if (data.data.p_info && data.data.p_info.image) {
        const imageSrc = `data:image/jpeg;base64, ${data.data.p_info.image}`;
        setProfileImagesrc(imageSrc);
      } else {
        console.error("Profile image not found in the API response.");
      }

      // Check Aadhar Card data

      if (
        data.data &&
        data.data.aadhaar &&
        Array.isArray(data.data.aadhaar) &&
        data.data.aadhaar.length > 0
      ) {
        setAadharDataPresent(true);
        setLabelData(
          "aadhar-id-number-label",
          data.data.aadhaar[0].aadhaar_number || "-"
        );
        setLabelData(
          "aadhar-address-label",
          data.data.aadhaar[0].address || "-"
        );
        setLabelData("aadhar-dob-label", data.data.aadhaar[0].issueDate || "-");
        setLabelData(
          "aadhar-gender-label",
          data.data.aadhaar[0].issueDate || "-"
        );

        // Set Aadhar Card image
        if (
          data.data.aadhaar &&
          data.data.aadhaar.length > 0 &&
          data.data.aadhaar[0].aadhaar_image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.aadhaar[0].aadhaar_image} `;
          setAadharImageSrc(imageSrc);
        } else {
          console.error("Aadhar Card image not found in the API response.");
        }
      }

      // Check PAN Card data

      if (
        data.data &&
        data.data.pan &&
        Array.isArray(data.data.pan) &&
        data.data.pan.length > 0
      ) {
        setpanDataPresent(true);
        setLabelData("pan-id-number-label", data.data.pan[0].pan_number || "-");
        setLabelData("pan-address-label", data.data.pan[0].issueDate || "-");
        setLabelData("pan-dob-label", data.data.pan[0].issueDate || "-");
        setLabelData("pan-gender-label", data.data.pan[0].issueDate || "-");

        // Set Pan Card image
        if (
          data.data.pan &&
          data.data.pan.length > 0 &&
          data.data.pan[0].image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.pan[0].image} `;
          setpanImageSrc(imageSrc);
        } else {
          console.error("Aadhar Card image not found in the API response.");
        }
      }

      // Check Driving License data

      if (
        data.data &&
        data.data.drivinglicense &&
        Array.isArray(data.data.drivinglicense) &&
        data.data.drivinglicense.length > 0
      ) {
        setdlDataPresent(true);
        setLabelData(
          "license-number-label",
          data.data.drivinglicense[0].dl_number || "-"
        );
        setLabelData(
          "license-validity-label",
          data.data.drivinglicense[0].issueDate || "-"
        );
        setLabelData(
          "license-dob-label",
          data.data.drivinglicense[0].issueDate || "-"
        );
        setLabelData(
          "license-gender-label",
          data.data.drivinglicense[0].issueDate || "-"
        );
        // Set drivinglicence image
        if (
          data.data.aadhaarcard &&
          data.data.aadhaarcard.length > 0 &&
          data.data.aadhaarcard[0].aadhaar_image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.aadhaarcard[0].aadhaar_image} `;
          setDLImagesrc(imageSrc);
        } else {
          console.error(
            "driving lincense  image not found in the API response."
          );
        }
      }

      // Check EDUCATIONAL QUALIFICATIONS//

      if (
        data.data &&
        data.data.education &&
        Array.isArray(data.data.education) &&
        data.data.education.length > 0
      ) {
        // Reset eqDataPresent state
        seteqDataPresent(true);

        // Loop through each set of educational qualifications
        data.data.education.forEach((education, index) => {
          // Set label data for each qualification
          setLabelData(
            `Institution-Name-label-${index}`,
            education.ints_clg_sc || "-"
          );
          setLabelData(
            `Degree-Name-label-${index}`,
            education.mj_cour_dg || "-"
          );
          setLabelData(
            `Year-Of-Passing-label-${index}`,
            education.end_year || "-"
          );
          setLabelData(`Honors-label-${index}`, education.board || "-");
          setLabelData(
            `Distinctions-label-${index}`,
            education.data_source || "-"
          );
        });
      }

      // Check EDUCATIONAL CERTIFICATE//

      // if (
      //   data.data &&
      //   data.data.education &&
      //   Array.isArray(data.data.education) &&
      //   data.data.education.length > 0
      // ) {
      //   setecDataPresent(true);
      //   setLabelData(
      //     "Institution-Name-label",
      //     data.data.education[0].dl_number || "-"
      //   );
      //   setLabelData(
      //     "Degree-Name-label",
      //     data.data.education[0].issueDate || "-"
      //   );
      //   setLabelData(
      //     "Year-Of-Passing-label",
      //     data.data.education[0].verificationLink || "-"
      //   );
      //   setLabelData(
      //     "Honors-label",
      //     data.data.education[0].verificationLink || "-"
      //   );
      //   setLabelData(
      //     "Distinctions-label",
      //     data.data.education[0].verificationLink || "-"
      //   );
      //   // Set education images image
      //   if (
      //     data.data.aadhaarcard &&
      //     data.data.aadhaarcard.length > 0 &&
      //     data.data.aadhaarcard[0].aadhaar_image
      //   ) {
      //     const imageSrc = `data:image/jpeg;base64, ${data.data.aadhaarcard[0].aadhaar_image} `;
      //     setECImagesrc(imageSrc);
      //   } else {
      //     console.error("Aadhar Card image not found in the API response.");
      //   }
      // }

      // Check EMPLOYMENT HISTORY //

      if (
        data.data &&
        data.data.employment &&
        Array.isArray(data.data.employment) &&
        data.data.employment.length > 0
      ) {
        // Reset eqDataPresent state
        seteqDataPresent(true);

        // Loop through each set of educational qualifications
        data.data.employment.forEach((employment, index) => {
          // Set label data for each qualification
          setLabelData(`Job-Name-label-${index}`, employment.dept || "-");
          setLabelData(`Company-Name-label-${index}`, employment.emp || "-");
          setLabelData(`Duration-label-${index}`, employment.end_date || "-");
          setLabelData(`Address-label-${index}`, employment.tt_exp_yr || "-");
          setLabelData(`Email-label-${index}`, employment.tt_exp_yr || "-");
          // Set drivinglicence image
          if (
            data.data.employment &&
            data.data.employment.length > 0 &&
            data.data.employment[0].aadhaar_image
          ) {
            const imageSrc = `data:image/jpeg;base64, ${data.data.employment[0].aadhaar_image} `;
            setDLImagesrc(imageSrc);
          } else {
            console.error(
              "driving lincense  image not found in the API response."
            );
          }
        });
      }

      // Check address details //

      if (
        data.data &&
        data.data.address &&
        Array.isArray(data.data.address) &&
        data.data.address.length > 0
      ) {
        setaddDataPresent(true);
        data.data.address.forEach((address, index) => {
          setLabelData(`Mainaddress-label-${index}`, address.house || "-");
          setLabelData(`Pincode-label-${index}`, address.zip || "-");
          setLabelData(`District-label-${index}`, address.dist || "-");
          setLabelData(`State-label-${index}`, address.state || "-");
        });
      }
    } else {
      console.log("data is empty");
      setError(true);
    }
  };

  // Function to set label text content
  const setLabelData = (labelId, value) => {
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      labelElement.textContent = value;
    }
  };

  const handleDownloadPDF = () => {
    // Function to handle PDF download
    const filename = `${username}_Saksham_Profile.pdf`; // Filename with username
    const element = document.getElementById("pdf-content"); // Get the element to convert to PDF
    html2pdf().from(element).save(filename);
  };

  // Render the component UI
  return (
    <div>
      {(loading || error) && (
        <div id="loading-message">
          {loading && (
            <h1>
              Pls Wait <br />
              Page is Generating...
            </h1>
          )}
          {error && (
            <div id="error-message">
              <h1>Error In Page Generating! Please try again later.</h1>
            </div>
          )}
        </div>
      )}
      {/* <div className="download-pdf-icon" onClick={handleDownloadPDF}>
          <i className="fas fa-download"></i>
      </div> */}
      {!loading && !error && data && (
        <div
          id="pdf-content"
          className="main"
          style={{ display: loading || error ? "none" : "block" }}>
          {/* Personal information */}
          <div className="personal-info">
            <h1>Saksham Profile</h1>
            <section>
              <div className="ps">
                <div className="profileimg">
                  <img
                    src={ProfileImagesrc}
                    alt="Not Uploded"
                    id="aadhar-image"
                  />
                </div>
                <div className="score">
                  <Score score={555} total={TotalScore} />
                  <p>Trust Score</p>
                </div>
              </div>
              <div className="pi">
                <label htmlFor="full-name-label">Name:</label>
                <label htmlFor="date-of-birth-label">DOB:</label>
                <label htmlFor="gender-label">Gender:</label>
                <label htmlFor="Fname-label">Father Name:</label>
                <label htmlFor="contact-Phone-label">Phone:</label>
                <label htmlFor="contact-Email-label">Email:</label>
              </div>
              <div className="dd">
                <p id="full-name-label">-</p>
                <p id="date-of-birth-label">-</p>
                <p id="gender-label">-</p>
                <p id="fname-label">-</p>
                <p id="contact-Phone-label">-</p>
                <p id="contact-Email-label">-</p>
              </div>
            </section>
          </div>

          <div className="creddata">
            <div className="apd">
              <h2>Identity</h2>
              {/* Aadhar Card */}
              <div
                className="MainCard"
                style={{ display: aadharDataPresent ? "block" : "none" }}>
                <div className="card">
                  <h2>Aadhar Card</h2>
                  <div className="cardinfo">
                    <div className="apdlable">
                      <p>Aadhar Number:</p>
                      <p>Address:</p>
                      <p>Date Of Birth:</p>
                      <p>Gender:</p>
                    </div>
                    <div className="apddata">
                      <label
                        htmlFor="aadhar-id-number-label"
                        id="aadhar-id-number-label">
                        -
                      </label>
                      <label
                        htmlFor="aadhar-address-label"
                        id="aadhar-address-label">
                        -
                      </label>
                      <label htmlFor="aadhar-dob-label" id="aadhar-dob-label">
                        -
                      </label>
                      <label
                        htmlFor="aadhar-gender-label"
                        id="aadhar-gender-label">
                        -
                      </label>
                    </div>
                  </div>
                  <div className="image-container">
                    <img
                      src={aadharImageSrc}
                      alt="Not Uploaded"
                      id="aadhar-image"
                    />
                  </div>
                </div>
                <div className="upbyadhar">
                  <p id="upbyadhar">Added {} / By Aadhar API</p>
                  <p id="upbyzoop">Latest verification Date {} / By Zoop API</p>
                </div>
              </div>

              {/* PAN Card */}
              <div
                className="MainCard"
                style={{ display: panDataPresent ? "block" : "none" }}>
                <div className="card">
                  <h2>PAN Card</h2>
                  <div className="cardinfo">
                    <div className="apdlable">
                      <p>PanCard Number:</p>
                      <p>Adress:</p>
                      <p>Date Of Birth:</p>
                      <p>Gender:</p>
                    </div>
                    <div className="apddata">
                      <label
                        htmlFor="pan-id-number-label"
                        id="pan-id-number-label">
                        -
                      </label>
                      <label htmlFor="pan-address-label" id="pan-address-label">
                        -
                      </label>
                      <label htmlFor="pan-dob-label" id="pan-dob-label">
                        -
                      </label>
                      <label htmlFor="pan-gender-label" id="pan-gender-label">
                        -
                      </label>
                    </div>
                  </div>
                  <div className="image-container">
                    <img
                      src={panImageSrc}
                      alt="Not Uploded"
                      id="aadhar-image"
                    />
                  </div>
                </div>
                <div className="upbyadhar">
                  <p id="upbyadhar">Added On {} / By Aadhar API</p>

                  <p id="upbyzoop">Latest verification Date {} / By Zoop API</p>
                </div>
              </div>

              {/* Driving License */}
              <div
                className="MainCard"
                style={{ display: dlDataPresent ? "block" : "none" }}>
                <div className="card">
                  <h2>Driving License</h2>
                  <div className="cardinfo">
                    <div className="apdlable">
                      <p>License Number:</p>
                      <p>Valid From/To: [Validity Dates]</p>
                      <p>Date Of Birth</p>
                      <p>Gender</p>
                    </div>
                    <div className="apddata">
                      <label
                        htmlFor="license-number-label"
                        id="license-number-label">
                        -
                      </label>
                      <label
                        htmlFor="license-validity-label"
                        id="license-validity-label">
                        -
                      </label>
                      <label htmlFor="license-dob-label" id="license-dob-label">
                        -
                      </label>
                      <label
                        htmlFor="license-gender-label"
                        id="license-gender-label">
                        -
                      </label>
                    </div>
                  </div>
                  <div className="image-container">
                    <img src={DLImagesrc} alt="Not Uploded" id="aadhar-image" />
                  </div>
                </div>
                <div className="upbyadhar">
                  <p id="upbyadhar">Added On {} / By Aadhar API</p>

                  <p id="upbyzoop">Latest verification Date {} / By Zoop API</p>
                </div>
              </div>
            </div>
            <div className="od">
              {/* <h2>Identity</h2> */}
              {/* EDUCATIONAL QUALIFICATIONS */}
              <div className="MainCard" style={{ border: "none" }}>
                <h2 className="eq">EDUCATIONAL DETAILS</h2>
                {eqDataPresent &&
                  data.data.employment &&
                  data.data.education.map((education, index) => (
                    <div className="mcard" key={index}>
                      <div className="card">
                        <div className="cardinfo">
                          {/* <div className="apdlable">
                            <p>Institution Name:</p>
                            <p>Degree Name:</p>
                            <p>Year Of Passing:</p>
                            <p>Honors:</p>
                            <p>Distinctions:</p>
                          </div> */}
                          <div className="apddata">
                            <h1 htmlFor={`Degree-Name-label-${index}`}>
                              {education.mj_cour_dg || "-"}
                            </h1>
                            <h3 htmlFor={`Institution-Name-label-${index}`}>
                              {education.ints_clg_sc || "-"}
                            </h3>
                            <h5 htmlFor={`Year-Of-Passing-label-${index}`}>
                              {education.end_year || "-"}
                            </h5>
                            {/* <label htmlFor={`Honors-label-${index}`}>
                            {education.board || "-"}
                          </label>
                          <label htmlFor={`Distinctions-label-${index}`}>
                            {education.data_source || "-"}
                          </label> */}
                          </div>
                        </div>
                      </div>
                      <div className="upbyadhar">
                        <p id="upbyadhar">
                          Added On {education.updated_date} / By Aadhar API
                        </p>
                        <p id="upbyzoop">
                          Latest verifation date {education.updated_date} / By
                          Zoop API
                        </p>
                      </div>
                      {/* <hr /> */}
                    </div>
                  ))}
              </div>

              {/* EMPLOYMENT HISTORY */}
              <div className="MainCard" style={{ border: "none" }}>
                <h2 className="eq">EMPLOYMENT HISTORY</h2>
                {eqDataPresent &&
                  data.data.employment &&
                  data.data.employment.map((employment, index) => (
                    <div className="mcard" key={index}>
                      <h5 style={{ margin: "20px" }}>{employment.tag}</h5>
                      <div className="card">
                        <div className="cardinfo">
                          {/* <div className="apdlable">
                            <p>Job Title:</p>
                            <p>Company Name:</p>
                            <p>Duration:</p>
                            <p>Expriance:</p>
                          </div> */}
                          <div className="apddata">
                            <h1 htmlFor={`Job-Name-label-${index}`}>
                              {employment.dept || "-"}
                            </h1>
                            <h2 htmlFor={`Company-Name-label-${index}`}>
                              {employment.emp || "-"} : {employment.type || "-"}
                            </h2>
                            <h5 htmlFor={`Duration-label-${index}`}>
                              {employment.start_date || "-"} TO{" "}
                              {employment.end_date || "-"}({" "}
                              {employment.tt_exp_yr || "-"} Yr{" "}
                              {employment.tt_exp_mnth || "-"} Mon )
                            </h5>
                            <h4 htmlFor={`Address-label-${index}`}>
                              {employment.loct || "-"}
                            </h4>
                            <h5 htmlFor={`Email-label-${index}`}>
                              {employment.em || "-"}
                            </h5>
                          </div>
                        </div>
                        {/* <div className="image-container">
                          <img
                            src={EHImagesrc}
                            alt="Not Uploded"
                            id="aadhar-image"
                          />
                        </div> */}
                      </div>
                      <div className="upbyadhar">
                        <p id="upbyadhar">
                          Added On {employment.updated_date} / By Aadhar API
                        </p>
                        <p id="upbyzoop">
                          Latest verifation date {employment.updated_date} / By
                          Zoop API
                        </p>
                      </div>
                      {/* <hr /> */}
                    </div>
                  ))}
              </div>

              {/* Address details */}

              <div className="MainCard" style={{ border: "none" }}>
                <h2 className="eq">Address Details</h2>
                {addDataPresent &&
                  data.data.address &&
                  data.data.address.map((address, index) => (
                    <div className="mcard" key={index}>
                      <h4 className="AH">{address.type}</h4>
                      <p
                        className="isv"
                        style={{
                          backgroundColor: address.is_verified
                            ? "green"
                            : "darkgray",
                        }}>
                        {address.is_verified ? "Verify" : "Not Verify"}
                      </p>

                      <div className="card">
                        <div className="cardinfo">
                          <div className="apddata">
                            <label htmlFor={`Mainaddress-label-${index}`}>
                              {address.house || "-"} - {address.street || "-"} -{" "}
                              {address.landmark || "-"}
                            </label>
                            <label htmlFor={`Pincode-label-${index}`}>
                              {address.zip || "-"}
                            </label>
                            <label htmlFor={`District-label-${index}`}>
                              {address.dist || "-"}
                            </label>
                            <label htmlFor={`State-label-${index}`}>
                              {address.state || "-"}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="upbyadhar">
                        <p id="upbyadhar">
                          Added On {address.updated_date} / By Aadhar API
                        </p>
                        <p id="upbyzoop">
                          Latest verifation date {address.updated_date} / By
                          Zoop API
                        </p>
                      </div>
                      {/* <hr /> */}
                    </div>
                  ))}
              </div>

              {/* EDUCATIONAL CERTIFICATIONS */}
              {/* <div
              className="mcard"
              style={{ display: ecDataPresent ? "block" : "none" }}>
              <div className="card">
                <div className="cardinfo">
                  <h2>EDUCATIONAL CERTIFICATE</h2>
                  <p>Issuing Organization:</p>
                  <label
                    htmlFor="Issuing-Organization-label"
                    id="Issuing-Organization-label">
                    -
                  </label>
                  <p>IsAdress</p>
                  <label htmlFor="Issuing-Date-label" id="Issuing-Date-label">
                    -
                  </label>
                </div>
                <div className="image-container">
                  <img src={ECImagesrc} alt="Not Uploded" id="aadhar-image" />
                </div>
              </div>
              <div className="upbyadhar">
                <p id="upbyadhar">
                  Added On {} / By Aadhar API
                </p>

                <p id="upbyzoop">
                Latest verifation Date {} / By Zoop API
                </p>
              </div>
              </div> */}

              {/* DECLARATION AND DIGITAL SIGNATURE */}
              {/* <div
                className="MainCard"
                style={{ display: dsDataPresent ? "block" : "none" }}>
                <div className="card">
                  <div className="cardinfo">
                    <h2>DECLARATION AND DIGITAL SIGNATURE</h2>
                    <p>Your Digital Signature:</p>
                    <label
                      htmlFor="Your-Digital-Signature-label"
                      id="Your-Digital-Signature-label">
                      -
                    </label>
                    <p>Date:</p>
                    <label htmlFor="Dsing-Date-label" id="Dsign-Date-label">
                      -
                    </label>
                  </div>
                  <div className="image-container">
                    <img src={DSImagesrc} alt="Not Uploded" id="aadhar-image" />
                  </div>
                </div>
                <div className="upbyadhar">
                  <p id="upbyadhar">Added On {} / By Aadhar API</p>

                  <p id="upbyzoop">
                    Latest verifation Date {} / By Zoop API
                  </p>
                </div>
              </div> */}

              {/* PRIVACY STATEMENT AND CONSENT */}

              {/* <div className="MainCard">
              <div className="card">
                <div className="cardinfo">
                  <h2 className="ph">PRIVACY STATEMENT AND CONSENT</h2>
                  <p className="pd">
                    A statement about the privacy and use of this document.
                    Consent clause for the verifier to use this document for
                    verification purposes only.
                  </p>
                </div>
              </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
