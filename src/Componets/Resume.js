import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "./Main.css";
import Score from "./Score";

const App = () => {
  const TotalScore = 1000;
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
  const [empDataPresent, setempDataPresent] = useState(false); // set for eduction qulification visibility
  const [Username, setUsername] = useState(""); // State variable to store username
  const [Acdatetime, setAcdatetime] = useState(""); // state var for save adharuploaded data and time
  const [Pcdatetime, setPcdatetime] = useState(""); // state var for save adharuploaded data and time
  const [Dldatetime, setDldatetime] = useState(""); // state var for save adharuploaded data and time
  const [Token, setToken] = useState("");
  

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Get the path name from the URL
        const pathName = window.location.pathname;

        // Extract the userId from the path
        const userId = pathName.split('/').pop();

        // Make sure userId is available
        if (!userId) {
          throw new Error('User ID not found in URL');
        }

        // Fetch token using the userId
        const response = await fetch(`https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/get_token?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setToken(data.Token)
        console.log("data for resume",data)
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
        setError(true);
      }
    };

    getUserData(); // Call getUserData when component mounts
  }, []); // Empty dependency array to run only once on mount

  // useEffect to make the API call when the component mounts
  useEffect(() => {
    const makeAPICall = async () => {
      if (Token === undefined) {
        setError("Token Not Found");
      } else {
        setLoading(true);
        try {
          const response = await fetch(
            `https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/get_resume_detail`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${Token}`,
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
            setLoading(true);
            // setError(result.message);
          }
        } catch (error) {
          console.error("Error fetching data from API:", error);
          setLoading(false);
          setError(true);
        }
      }
    };

    makeAPICall();
  }, [Token]);


  useEffect(() => {
    if (data) {
      setDataLabels(data);
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
        setLabelData("aadhar-dob-label", data.data.aadhaar[0].dob || "-");
        setLabelData(
          "aadhar-gender-label",
          data.data.aadhaar[0].gender || "-"
        );

        setAcdatetime(data.data.aadhaar[0].identity_verification_date)


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
        setPcdatetime(data.data.pan[0].identity_verification_date)

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
        setDldatetime(data.data.drivinglicense[0].identity_verification_date)
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
            education.institute_name || "-"
          );
          setLabelData(
            `Degree-Name-label-${index}`,
            education.mj_cour_dg || "-"
          );
          setLabelData(
            `Year-Of-Passing-label-${index}`,
            education.end_year || "-"
          );
          setLabelData(
            `Honors-label-${index}`,
            education.uni_board_name || "-"
          );
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
        setempDataPresent(true);

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
    console.log("Username",Username)
    // const filename = `${Username}_Saksham_Profile.pdf`; // Filename with username
    const options = {
      filename: `${Username}_Saksham_Resume.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { format: 'a4', orientation: 'landscape' }
    };
    const element = document.getElementById("pdf-content"); // Get the element to convert to PDF
    html2pdf()
    .from(element)
    .set(options)
    .save();
  };

  // Function to format date string to "DD MMM YYYY" format
  const formatDate = (dateString) => {
    const options = { month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  const formatDate1 = (dateString) => {
    const options = { year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Render the component UI
  return (
    <div>
      {(loading) && (
        <div id="loading-message">
          <div className="loader1" style={{marginLeft:"180px", marginBottom:"50px"}}></div><br/>
          {loading && <h1 style={{display:"flex",fontSize:"18px"}}>Please wait, while we generate your resume...</h1>}
        </div>
      )}
      
      {!loading && data && (
        <div
          id="pdf-content"
          className="main"
          style={{ display: loading ? "none" : "block" }}>
          <div className="download-pdf-icon" onClick={handleDownloadPDF}>
            <i className="fas fa-download"></i>
          </div>
          {/* Personal information */}
          <div className="personal-info">
            <h1>Saksham Resume</h1>
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
                  <Score score={888} total={TotalScore} />
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
                <div className="ab">
                  <div className="card">
                    <div className="carddata">
                      <div className="cardinfo">
                        <h1>Aadhar Card</h1>
                        <p>Aadhar Number:</p>
                        <label
                          htmlFor="aadhar-id-number-label"
                          id="aadhar-id-number-label">
                          -
                        </label>
                        <p>Address:</p>
                        <label
                          htmlFor="aadhar-address-label"
                          id="aadhar-address-label">
                          -
                        </label>
                        <p>Date Of Birth:</p>
                        <div className="aadhar-dob">
                          <label
                            htmlFor="aadhar-dob-label"
                            id="aadhar-dob-label">
                            -
                          </label>
                        </div>
                        <p>Gender:</p>
                        <div className="aadhar-gender">
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
                          alt="Not Uploded"
                          id="aadhar-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On {Acdatetime}/ By Aadhar API</p>

                    <p id="upbyzoop">Latest verification Date {Acdatetime} / By Zoop API</p>
                  </div>
                </div>
              </div>

              {/* PAN Card */}
              <div
                className="MainCard"
                style={{ display: panDataPresent ? "block" : "none" }}>
                <div className="ab">
                  <div className="card">
                    <div className="carddata">
                      <div className="cardinfo">
                        <h1>PAN Card</h1>
                        <p>PanCard Number:</p>
                        <label
                          htmlFor="pan-id-number-label"
                          id="pan-id-number-label">
                          -
                        </label>
                        <p>Adress:</p>
                        <label
                          htmlFor="pan-address-label"
                          id="pan-address-label">
                          -
                        </label>
                        <p>Date Of Birth:</p>
                        <div className="pan-dob">
                          <label htmlFor="pan-dob-label" id="pan-dob-label">
                            -
                          </label>
                        </div>
                        <p>Gender:</p>
                        <div className="pan-gender">
                          <label
                            htmlFor="pan-gender-label"
                            id="pan-gender-label">
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
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On  {Pcdatetime}/ By Aadhar API</p>

                    <p id="upbyzoop">Latest verification Date  {Pcdatetime}/ By Zoop API</p>
                  </div>
                </div>
              </div>

              {/* Driving License */}
              <div
                className="MainCard"
                style={{ display: dlDataPresent ? "block" : "none" }}>
                <div className="card">
                  <div className="ab">
                    <div className="carddata">
                      <div className="cardinfo">
                        <h1>Driving License</h1>
                        <p>License Number:</p>
                        <label
                          htmlFor="license-number-label"
                          id="license-number-label">
                          -
                        </label>
                        <p>Valid From/To: [Validity Dates]</p>
                        <label
                          htmlFor="license-validity-label"
                          id="license-validity-label">
                          -
                        </label>
                        <p>Date Of Birth</p>
                        <div className="license-dob">
                          <label
                            htmlFor="license-dob-label"
                            id="license-dob-label">
                            -
                          </label>
                        </div>
                        <p>Gender</p>
                        <div className="license-gender">
                          <label
                            htmlFor="license-gender-label"
                            id="license-gender-label">
                            -
                          </label>
                        </div>
                      </div>
                      <div className="image-container">
                        <img
                          src={DLImagesrc}
                          alt="Not Uploded"
                          id="aadhar-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On {Dldatetime}/ By Aadhar API</p>

                    <p id="upbyzoop">Latest verification Date {Dldatetime}/ By Zoop API</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="od">
              {/* <h2>Identity</h2> */}

              {/* EDUCATIONAL QUALIFICATIONS */}
              <div className="MainCard" style={{ display: eqDataPresent ? "block" : "none", border:"none"}}>
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
                              {education.degree_name || "-"}
                            </h1>
                            <h3 htmlFor={`Institution-Name-label-${index}`}>
                              {education.institute_name || "-"}
                            </h3>
                            <h5 htmlFor={`Year-Of-Passing-label-${index}`}>
                            [{education.course_start_year || "-"}] TO [{education.course_end_year || "-"}]
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
              <div className="MainCard" style={{ display: empDataPresent ? "block" : "none", border:"none" }}>
                <h2 className="eq">EMPLOYMENT HISTORY</h2>
                {eqDataPresent &&
                  data.data.employment &&
                  data.data.employment.map((employment, index) => (
                    <div className="mcard" key={index}>
                      {/* <p className="at">{employment.employment_type}</p> */}
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
                              {employment.designation || "-"}
                            </h1>
                            <h3 htmlFor={`Company-Name-label-${index}`}>
                            {employment.organization_name}:{employment.employment_type === "1" ? "Full Time" :"null" && employment.employment_type === "2" ? "Internship" :"null" && employment.employment_type === "3" ? "Contract" :"null" && employment.employment_type === "4" ? "Part Time" : "Null" && employment.employment_type === "5" ? "Freelance" : "Null"}
                            </h3>
                            <h5 htmlFor={`Duration-label-${index}`}>
                            {formatDate(employment.from_date)} TO {formatDate(employment.to_date)}
                              {/* {employment.tt_exp_yr || "-"} Yr{" "}
                              {employment.tt_exp_mnth || "-"} Mon ) */}
                            </h5>
                            <h4 htmlFor={`Address-label-${index}`}>
                              {employment.organization_location || "-"}
                            </h4>
                            <h5 htmlFor={`Email-label-${index}`}>
                              {employment.email_id || "-"}
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

              <div className="MainCard" style={{ display: addDataPresent ? "block" : "none",border:"none" }}>
                <h2 className="eq">Address Details</h2>
                {addDataPresent &&
                  data.data.address &&
                  data.data.address.map((address, index) => (
                    <div className="mcard" key={index}>
                      <p className="at">
                      {address.type === "1" ? "As Per AdharCard" :"null" && address.type === "5" ? "Present" :"null" && address.type === "6" ? "Permanent" :"null" && address.type === "7" ? "Past" : "Null"}
                      </p>

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
                            <label htmlFor={`State-label-${index}`}>
                              {formatDate1(address.start_date)} TO {formatDate1(address.end_date)}
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
