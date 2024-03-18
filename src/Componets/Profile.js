import React, { useEffect, useState } from "react";
// import html2pdf from "html2pdf.js";
import "./Main.css";
import Score from "./Score";
// import QRimg from "../Images/qr.png";
import Ticimg from "../Images/btick.png";
import Qsimg from "../Images/question.png";

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
  const [empDataPresent, setempDataPresent] = useState(false); // set for eduction qulification visibility
  // const [Username, setUsername] = useState(""); // State variable to store username
  const [Acdatetime, setAcdatetime] = useState(""); // state var for save adharuploaded data and time
  const [Pcdatetime, setPcdatetime] = useState(""); // state var for save adharuploaded data and time
  const [Dldatetime, setDldatetime] = useState(""); // state var for save adharuploaded data and time
  const [age, setAge] = useState(null);

  // useEffect to make the API call when the component mounts

  useEffect(() => {
    const makeAPICall = async () => {
      if (authToken === undefined) {
        setError("Token Not Found");
      } else {
        setLoading(true);
        try {
          
          const response = await fetch(
            `https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/get_viewer_attribute_list?id=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              // signal // Pass the signal to the fetch request
            }
          );
          // clearTimeout(timeoutId); // Clear timeout since the request succeeded
          const result = await response.json();

          if (result.Status_Code === 200) {
            setData(result);
            // Assuming 'data' is your state variable holding API response
            const years = calculateAge(result.data.p_info.dob);
            setAge(years);
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
      // setUsername(data.data.p_info.fullname);
      setLabelData("full-name-label", data.data.p_info.fullname || "-");
      setLabelData("date-of-birth-label", `${age} Years` || "-");
      setLabelData(
        "gender-label",
        data.data.p_info.gender === "1"
          ? "Male"
          : "-" && data.data.p_info.gender === "2"
          ? "Female"
          : "-"
      );
      setLabelData("fname-label", data.data.p_info.father_name || "-");
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
          data.data.aadhaar[0].gender === "1"
            ? "Male"
            : "-" && data.data.aadhaar[0].gender === "2"
            ? "Female"
            : "-"
        );

        setAcdatetime(data.data.aadhaar[0].identity_verification_date);

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
        setLabelData("pan-address-label", data.data.pan[0].address || "-");
        setLabelData("pan-dob-label", data.data.pan[0].dob || "-");
        setLabelData(
          "pan-gender-label",
          data.data.pan[0].gender === "1"
            ? "Male"
            : "-" && data.data.pan[0].gender === "2"
            ? "Female"
            : "-"
        );
        setPcdatetime(data.data.pan[0].identity_verification_date);

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
        setDldatetime(data.data.drivinglicense[0].identity_verification_date);
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

  // Function to format date string to "DD MMM YYYY" format
  const formatDate = (dateString) => {
    const options = { month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // get the only totla year between two dates
  const calculateAge = (dob) => {
    // Split the date string into day, month, and year
    const [day, month, year] = dob.split("-");
    // Construct a Date object from the parsed components
    const birthDate = new Date(`${month}-${day}-${year}`);
    // Get the current date
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // const handleDownloadPDF = () => {
  //   // Function to handle PDF download
  //   const filename = `Saksham_Profile.pdf`; // Filename with username
  //   const element = document.getElementById("pdf-content"); // Get the element to convert to PDF
  //   html2pdf().from(element).save(filename);
  // };

  const getAddressName = (type) => {
    switch (type) {
      case "1":
        return "As per Aadhaar";
      case "2":
        return "As per PAN";
      case "5":
        return "Present";
      case "6":
        return "Permanent";
      case "7":
        return "Past";
      default:
        return "Null";
    }
  };

  // Render the component UI
  return (
    <div>
      {(loading || error) && (
        <div id="loading-message">
          {loading && <h1>Pls Wait...</h1>}
          {error && (
            <div id="error-message">
              <h1>Error In Page Generating! Please try again later.</h1>
            </div>
          )}
        </div>
      )}

      {!loading && !error && data && (
        <div
          id="pdf-content"
          className="main"
          style={{ display: loading || error ? "none" : "block" }}>
          {/* <div className="download-pdf-icon" onClick={handleDownloadPDF}>
            <i className="fas fa-download"></i>
          </div> */}
          {/* Personal information */}
          <div className="personal-info">
            <h1 className="sh">Saksham Profile</h1>
            <section>
              <div className="pid">
                <div className="ps">
                  <div className="pi">
                    <p id="full-name-label">-</p>
                    <span>
                      <img
                        src={Ticimg}
                        alt="not found"
                        height={30}
                        width={30}></img>
                    </span>
                  </div>
                  <div className="dd">
                    <p id="date-of-birth-label"></p>
                    <span>/</span>
                    <p id="gender-label"></p>
                  </div>
                </div>
                <div className="profileimg">
                  <img
                    src={ProfileImagesrc}
                    alt="Not Uploded"
                    id="aadhar-image"
                  />
                  {/* <span>
                    <img src={QRimg} alt="not found"></img>
                </span> */}
                </div>
              </div>
              <div className="scoresection">
                <div className="score">
                  <Score score={777} total={TotalScore} />
                  <div className="tsi">
                    <p>Trust Score</p>
                    <img src={Qsimg} alt="not found"></img>
                  </div>
                </div>
                <div className="score">
                  <Score score={777} total={TotalScore} />
                  <div className="tsi">
                    <p>Cibil Score</p>
                    <img src={Qsimg} alt="not found"></img>
                  </div>
                </div>
                <div className="score">
                  <Score score={777} total={TotalScore} />
                  <div className="tsi">
                    <p>Credit Score</p>
                    <img src={Qsimg} alt="not found"></img>
                  </div>
                </div>
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
                        <p>Aadhaar Number:</p>
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
                        <div className="aadhar-dob">
                          <p>Date Of Birth:</p>
                          <label
                            htmlFor="aadhar-dob-label"
                            id="aadhar-dob-label">
                            -
                          </label>
                        </div>
                        <div className="aadhar-gender">
                          <p>Gender:</p>
                          <label
                            htmlFor="aadhar-gender-label"
                            id="aadhar-gender-label">
                            -
                          </label>
                        </div>
                      </div>
                      <div className="image-container">
                        <h1>Aadhaar Card</h1>
                        <img
                          src={aadharImageSrc}
                          alt="Not Uploded"
                          id="aadhar-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On {Acdatetime}</p>

                    <p id="upbyzoop">Latest verification Date {Acdatetime}</p>
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
                        <p>PAN</p>
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
                        <div className="aadhar-dob">
                          <p>Date Of Birth:</p>
                          <label htmlFor="pan-dob-label" id="pan-dob-label">
                            -
                          </label>
                        </div>
                        <div className="aadhar-gender">
                          <p>Gender:</p>
                          <label
                            htmlFor="pan-gender-label"
                            id="pan-gender-label">
                            -
                          </label>
                        </div>
                      </div>
                      <div className="image-container">
                        <h1>PAN Card</h1>
                        <img
                          src={panImageSrc}
                          alt="Not Uploded"
                          id="aadhar-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On {Pcdatetime}</p>

                    <p id="upbyzoop">Latest verification Date {Pcdatetime}</p>
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
                        <p>License Number:</p>
                        <label
                          htmlFor="license-number-label"
                          id="license-number-label">
                          -
                        </label>
                        <p>Valid From/To:</p>
                        <label
                          htmlFor="license-validity-label"
                          id="license-validity-label">
                          -
                        </label>
                        <div className="aadhar-dob">
                          <p>Date Of Birth</p>
                          <label
                            htmlFor="license-dob-label"
                            id="license-dob-label">
                            -
                          </label>
                        </div>
                        <div className="aadhar-gender">
                          <p>Gender</p>
                          <label
                            htmlFor="license-gender-label"
                            id="license-gender-label">
                            -
                          </label>
                        </div>
                      </div>
                      <div className="image-container">
                        <h1>Driving License</h1>
                        <img
                          src={DLImagesrc}
                          alt="Not Uploded"
                          id="aadhar-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upbyadhar">
                    <p id="upbyadhar">Added On {Dldatetime}</p>

                    <p id="upbyzoop">Latest verification Date {Dldatetime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="od">
              {/* <h2>Identity</h2> */}

              {/* EDUCATIONAL QUALIFICATIONS */}
              <div
                className="MainCard"
                style={{
                  display: eqDataPresent ? "block" : "none",
                  border: "none",
                }}>
                <h1 className="eh">Educational Details</h1>
                {eqDataPresent &&
                  data.data.education &&
                  data.data.education.map((education, index) => (
                    <div className="mcard" key={index}>
                      <p
                        className="isv"
                        style={{
                          backgroundColor: education.is_verified
                            ? "green"
                            : "darkgray",
                        }}>
                        {education.is_verified ? "Verified" : "Not Verified"}
                      </p>
                      <div className="card">
                        <div className="carddata">
                          <div className="cardinfo">
                            <div className="apddata">
                              <h1 htmlFor={`Degree-Name-label-${index}`}>
                                {education.degree_name === "1"
                                  ? "10th"
                                  : " " && education.degree_name === "2"
                                  ? "12th"
                                  : " " && education.degree_name === "3"
                                  ? "Diploma"
                                  : " " && education.degree_name === "4"
                                  ? "Graduate"
                                  : " " && education.degree_name === "5"
                                  ? "Post Graduate"
                                  : " " && education.degree_name === "6"
                                  ? "Doctorate"
                                  : " "}
                              </h1>
                              <h5 htmlFor={`Institution-Name-label-${index}`}>
                                {education.institute_name || ""}
                              </h5>
                              <h5 htmlFor={`Year-Of-Passing-label-${index}`}>
                                [{education.course_start_year || ""}] TO [
                                {education.course_end_year || ""}]
                              </h5>
                              {/* <label htmlFor={`Honors-label-${index}`}>
                            {education.board || "-"}
                          </label>
                          <label htmlFor={`Distinctions-label-${index}`}>
                            {education.data_source || "-"}
                          </label> */}
                            </div>
                          </div>
                          <div className="image-container1">
                            <h1>Marksheet</h1>
                            <img
                              src={aadharImageSrc}
                              alt="Not Uploded"
                              id="aadhar-image"
                            />
                          </div>
                        </div>
                      </div>
                      {education.is_verified ? (
                        <div className="upbyadhar">
                          <p id="upbyadhar">
                            Added On {education.updated_date}
                          </p>
                          <p id="upbyzoop">
                            Latest Verification Date {education.updated_date}
                          </p>
                        </div>
                      ) : (
                        <div className="update">
                          <p id="upbyadhar">
                            {" "}
                            Updated Date {education.updated_date}{" "}
                          </p>
                        </div>
                      )}
                      {/* <hr /> */}
                    </div>
                  ))}
              </div>

              {/* EMPLOYMENT HISTORY */}
              <div
                className="MainCard"
                style={{
                  display: empDataPresent ? "block" : "none",
                  border: "none",
                }}>
                <h2 className="eq">Employment History</h2>
                {empDataPresent &&
                  data.data.employment &&
                  data.data.employment.map((employment, index) => (
                    <div className="mcard" key={index}>
                      <p className="at">
                        {employment.curr_past_organization === "Current"
                          ? "Current"
                          : "-" && employment.curr_past_organization === "Past"
                          ? "Past"
                          : "-" && employment.is_verified === true
                          ? "As per EPFO"
                          : "-"}
                      </p>
                      <p
                        className="isv"
                        style={{
                          backgroundColor: employment.is_verified
                            ? "green"
                            : "darkgray",
                        }}>
                        {employment.is_verified ? "Verified" : "Not Verified"}
                      </p>
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
                              {employment.designation || ""}
                            </h1>
                            <h5 htmlFor={`Company-Name-label-${index}`}>
                              {employment.organization_name}:
                              {employment.employment_type === "1"
                                ? "Full Time"
                                : " " && employment.employment_type === "2"
                                ? "Internship"
                                : " " && employment.employment_type === "3"
                                ? "Contract"
                                : " " && employment.employment_type === "4"
                                ? "Part Time"
                                : " " && employment.employment_type === "5"
                                ? "Freelance"
                                : " "}
                            </h5>
                            <h5 htmlFor={`Duration-label-${index}`}>
                              {formatDate(employment.from_date)} TO{" "}
                              {formatDate(employment.to_date)}
                              {/* {employment.tt_exp_yr || "-"} Yr{" "}
                              {employment.tt_exp_mnth || "-"} Mon ) */}
                            </h5>
                            <h4 htmlFor={`Address-label-${index}`}>
                              {employment.organization_location || ""}
                            </h4>
                            <h5 htmlFor={`Email-label-${index}`}>
                              {employment.email_id || ""}
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
                      {employment.is_verified ? (
                        <div className="upbyadhar">
                          <p id="upbyadhar">
                            Added On {employment.updated_date}
                          </p>
                          <p id="upbyzoop">
                            Latest Verification Date {employment.updated_date}
                          </p>
                        </div>
                      ) : (
                        <div className="update">
                          <p id="upbyadhar">
                            {" "}
                            Updated Date {employment.updated_date}{" "}
                          </p>
                        </div>
                      )}
                      {/* <hr /> */}
                    </div>
                  ))}
              </div>

              {/* Address details */}

              <div
                className="MainCard"
                style={{
                  display: addDataPresent ? "block" : "none",
                  border: "none",
                }}>
                <h2 className="eq">Address Details</h2>
                {addDataPresent &&
                  data.data.address &&
                  data.data.address.map((address, index) => (
                    <div className="mcard" key={index}>
                      {/* <p className="at">
                      {address.type === "1" ? "As Per AdharCard" :"null" && address.type === "2" ? "Pan-Permanent" :"null" && address.type === "5" ? "Present" :"null" && address.type === "6" ? "Permanent" :"null" && address.type === "7" ? "Past" : "Null"}
                      </p> */}
                      <p className="at">{getAddressName(address.type)}</p>

                      <p
                        className="isv"
                        style={{
                          backgroundColor: address.is_verified
                            ? "green"
                            : "darkgray",
                        }}>
                        {address.is_verified ? "Verified" : "Not Verified"}
                      </p>

                      <div className="card">
                        <div className="cardinfo">
                          <div className="apddata">
                            <h5 htmlFor={`Mainaddress-label-${index}`}>
                              {address.house || "-"} - {address.street || "-"} -{" "}
                              {address.landmark || "-"}
                            </h5>
                            <h5 htmlFor={`Pincode-label-${index}`}>
                              {address.zip || "-"}
                            </h5>
                            <h5 htmlFor={`District-label-${index}`}>
                              {address.dist || "-"}
                            </h5>
                            <h5 htmlFor={`State-label-${index}`}>
                              {address.state || "-"}
                            </h5>
                            {/* <label htmlFor={`State-label-${index}`}>
                              {formatDate1(address.start_date)} TO {formatDate1(address.end_date)}
                            </label> */}
                          </div>
                        </div>
                      </div>
                      {address.is_verified ? (
                        <div className="upbyadhar">
                          <p id="upbyadhar">Added On {address.updated_date}</p>
                          <p id="upbyzoop">
                            Latest Verification Date {address.updated_date}
                          </p>
                        </div>
                      ) : (
                        <div className="update">
                          <p id="upbyadhar">
                            {" "}
                            Updated Date {address.updated_date}{" "}
                          </p>
                        </div>
                      )}
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

              <div className="MainCard">
                <div className="mcard">
                  <div className="footer">
                    <h2>CONFIDENTIAL</h2>
                    <p>
                      This verification report contains privileged and
                      confidential information intended solely for the recipient
                      named above. If you are not the intended recipient, you
                      are hereby notified that any dissemination, distribution,
                      or copying of this report is strictly prohibited. Please
                      notify the sender immediately and delete all copies of
                      this report from your system.
                    </p>
                    <h2>DISCLAIMER</h2>
                    <p>
                      This verification report is provided for informational
                      purposes only and is based on the information available at
                      the time of its creation. While every effort has been made
                      to ensure the accuracy and completeness of the information
                      contained herein, we make no representations or warranties
                      of any kind, express or implied, about the accuracy,
                      reliability, or suitability of this report for any
                      particular purpose. The recipient acknowledges that the
                      findings in this report are subject to change and should
                      be independently verified. We shall not be liable for any
                      damages or losses arising from the use of or reliance on
                      this report.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <hr></hr> */}
          <h6 className="fh">All rights reserved. © 2024 <span>Saksham</span></h6>
        </div>
      )}
    </div>
  );
};

export default App;
