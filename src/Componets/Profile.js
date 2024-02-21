import React, { useEffect, useState } from "react";
import "./Main.css";

const App = (Newdata) => {
  const { userId, authToken } = Newdata;
  // console.log('userId for profile', userId);
  // console.log('authToken: profile', authToken);
  // State variables to manage loading, error, and API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aadharImageSrc, setAadharImageSrc] = useState("");
  const [panImageSrc, setpanImageSrc] = useState("");
  const [ProfileImagesrc, setProfileImagesrc] = useState("");

  // useEffect to make the API call when the component mounts
  useEffect(() => {
    console.log("API is calling");

    const makeAPICall = async () => {
      if (authToken === undefined) {
        setError("Token Not Found");
      } else {
        setLoading(true);
        try {
          // Make API call
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
          console.log(result);

          // Handle API response
          if (result.Status_Code === 200) {
            setLoading(false);
            setDataLabels(result); // Call setDataLabels to update labels with the new data
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
  }, [null]);

  // Function to set label data based on the API response
  const setDataLabels = (data) => {
    
    if (data !== null) {
      var adharelement = document.getElementById("adharid").style.display = "none";
      var panelement = document.getElementById("panid").style.display = "none";;
      var dlelement = document.getElementById("dlid").style.display = "none";;
      var eqelement = document.getElementById("eqid").style.display = "none";;
      var ehelement = document.getElementById("ehid").style.display = "none";;
      var ecelement = document.getElementById("ecid").style.display = "none";;
      var dselement = document.getElementById("dsid").style.display = "none";;

      // adharelement.style.display = "none";
      // panelement.style.display = "none";
      // dlelement.style.display = "none";
      // eqelement.style.display = "none";
      // ehelement.style.display = "none";
      // ecelement.style.display = "none";
      // dselement.style.display = "none";
      
// Set personal information // 

      setLabelData("full-name-label", data.data.p_info.fullname || "-");
      setLabelData("full-name-label-pinfo", data.data.p_info.fullname || "-");
      setLabelData("date-of-birth-label", data.data.p_info.dob || "-");
      setLabelData("contact-Phone-label", data.data.p_info.phonenumber || "-");
      setLabelData("contact-Email-label", data.data.p_info.mail || "-");
      // Set Aadhar Card image
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
        adharelement.style.display = "flex"; //set the true for displaying data
        setLabelData(
          "aadhar-id-number-label",
          data.data.aadhaar[0].aadhaar_number || "-"
        );
        setLabelData(
          "aadhar-issue-date-label",
          data.data.aadhaar[0].issueDate || "-"
        );
        setLabelData(
          "aadhar-verification-link-label",
          data.data.aadhaar[0].verificationLink || "-"
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
        panelement.style.display = "flex"; //set the true for displaying data
        setLabelData("pan-id-number-label", data.data.pan[0].pan_number || "-");
        setLabelData("pan-issue-date-label", data.data.pan[0].issueDate || "-");
        setLabelData(
          "pan-verification-link-label",
          data.data.pan[0].verificationLink || "-"
        );
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
        dlelement.style.display = "flex"; //set the true for displaying data
        setLabelData(
          "license-number-label",
          data.data.drivinglicense[0].dl_number || "-"
        );
        setLabelData(
          "license-validity-label",
          data.data.drivinglicense[0].issueDate || "-"
        );
        setLabelData(
          "license-verification-link-label",
          data.data.drivinglicense[0].verificationLink || "-"
        );
        // Set drivinglicence image
        if (
          data.data.aadhaarcard &&
          data.data.aadhaarcard.length > 0 &&
          data.data.aadhaarcard[0].aadhaar_image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.aadhaarcard[0].aadhaar_image} `;
          setAadharImageSrc(imageSrc);
        } else {
          console.error("Aadhar Card image not found in the API response.");
        }
      }

// Check EDUCATIONAL QUALIFICATIONS//

       if (
        data.data &&
        data.data.education &&
        Array.isArray(data.data.education) &&
        data.data.education.length > 0
      ) {
        eqelement.style.display = "flex";
        setLabelData(
          "Institution-Name-label",
          data.data.education[0].dl_number || "-"
        );
        setLabelData(
          "Degree-Name-label",
          data.data.education[0].issueDate || "-"
        );
        setLabelData(
          "Year-Of-Passing-label",
          data.data.education[0].verificationLink || "-"
        );
        setLabelData(
          "Honors-label",
          data.data.education[0].verificationLink || "-"
        );
        setLabelData(
          "Distinctions-label",
          data.data.education[0].verificationLink || "-"
        );
        // Set Educational image
        if (
          data.data.education &&
          data.data.education.length > 0 &&
          data.data.education[0].aadhaar_image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.education[0].aadhaar_image} `;
          setAadharImageSrc(imageSrc);
        } else {
          console.error("Aadhar Card image not found in the API response.");
        }
      }

// Check EDUCATIONAL CERTIFICATE//

       if (
        data.data &&
        data.data.education &&
        Array.isArray(data.data.education) &&
        data.data.education.length > 0
      ) {
        ecelement.style.display = "flex"; //set the true for displaying data
        setLabelData(
          "Institution-Name-label",
          data.data.education[0].dl_number || "-"
        );
        setLabelData(
          "Degree-Name-label",
          data.data.education[0].issueDate || "-"
        );
        setLabelData(
          "Year-Of-Passing-label",
          data.data.education[0].verificationLink || "-"
        );
        setLabelData(
          "Honors-label",
          data.data.education[0].verificationLink || "-"
        );
        setLabelData(
          "Distinctions-label",
          data.data.education[0].verificationLink || "-"
        );
        // Set Aadhar Card image
        if (
          data.data.aadhaarcard &&
          data.data.aadhaarcard.length > 0 &&
          data.data.aadhaarcard[0].aadhaar_image
        ) {
          const imageSrc = `data:image/jpeg;base64, ${data.data.aadhaarcard[0].aadhaar_image} `;
          setAadharImageSrc(imageSrc);
        } else {
          console.error("Aadhar Card image not found in the API response.");
        }
      }


// Check EMPLOYMENT HISTORY //

     if (
      data.data &&
      data.data.employment &&
      Array.isArray(data.data.employment) &&
      data.data.employment.length > 0
    ) {
      ehelement.style.display = "flex"; //set the true for displaying data
      setLabelData(
        "Institution-Name-label",
        data.data.employment[0].dl_number || "-"
      );
      setLabelData(
        "Degree-Name-label",
        data.data.employment[0].issueDate || "-"
      );
      setLabelData(
        "Year-Of-Passing-label",
        data.data.employment[0].verificationLink || "-"
      );
      setLabelData(
        "Honors-label",
        data.data.employment[0].verificationLink || "-"
      );
      setLabelData(
        "Distinctions-label",
        data.data.employment[0].verificationLink || "-"
      );
      // Set Aadhar Card image
      if (
        data.data.employment &&
        data.data.employment.length > 0 &&
        data.data.employment[0].aadhaar_image
      ) {
        const imageSrc = `data:image/jpeg;base64, ${data.data.employment[0].aadhaar_image} `;
        setAadharImageSrc(imageSrc);
      } else {
        console.error("Aadhar Card image not found in the API response.");
      }
    }

// Check DIGITAL SIGNNATURE //

    if (
      data.data &&
      data.data.employment &&
      Array.isArray(data.data.employment) &&
      data.data.employment.length > 0
    ) {
      dselement.style.display = "flex"; //set the true for displaying data
      setLabelData(
        "Institution-Name-label",
        data.data.employment[0].dl_number || "-"
      );
      setLabelData(
        "Degree-Name-label",
        data.data.employment[0].issueDate || "-"
      );
      setLabelData(
        "Year-Of-Passing-label",
        data.data.employment[0].verificationLink || "-"
      );
      setLabelData(
        "Honors-label",
        data.data.employment[0].verificationLink || "-"
      );
      setLabelData(
        "Distinctions-label",
        data.data.employment[0].verificationLink || "-"
      );
      // Set Aadhar Card image
      if (
        data.data.employment &&
        data.data.employment.length > 0 &&
        data.data.employment[0].aadhaar_image
      ) {
        const imageSrc = `data:image/jpeg;base64, ${data.data.employment[0].aadhaar_image} `;
        setAadharImageSrc(imageSrc);
      } else {
        console.error("Aadhar Card image not found in the API response.");
      }
    }

    } 
    else {
      console.log("data is empty");
    }
  };

  // Function to set label text content
  const setLabelData = (labelId, value) => {
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      labelElement.textContent = value;
    }
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

      <div
        className="main"
        style={{ display: loading || error ? "none" : "block" }}>
        <div className="aphead">
          <h1>VERIFIABLE PROFILE <br/>OF</h1>
          <h2 id="full-name-label">-</h2>
          <div className="profileimg">
            <img src={ProfileImagesrc} alt="Not Uploded" id="aadhar-image" />
          </div>
        </div>
        <hr />
        {/* Personal information */}
        <div className="personal-info">
          <h2>PERSONAL INFORMATION</h2>
          <section>
            <div className="pi">
              <label htmlFor="full-name-label">Full Name:</label>
              <label htmlFor="date-of-birth-label">Date of Birth:</label>
              <label htmlFor="contact-Phone-label">Phone No:</label>
              <label htmlFor="contact-Email-label">Email Id:</label>
            </div>
            <div className="dd">
              <p id="full-name-label-pinfo">-</p>
              <p id="date-of-birth-label">-</p>
              <p id="contact-Phone-label">-</p>
              <p id="contact-Email-label">-</p>
            </div>
          </section>
        </div>

        <div className="creddata">

          {/* Aadhar Card */}
          <div className="mcard" id="adharid">
            <div className="card">
              <div className="cardinfo">
                <h2>Aadhar Card</h2>
                <p>Aadhar Number:</p>
                <label
                  htmlFor="aadhar-id-number-label"
                  id="aadhar-id-number-label">
                  -
                </label>
                <p>Issue Date:</p>
                <label
                  htmlFor="aadhar-issue-date-label"
                  id="aadhar-issue-date-label">
                  -
                </label>
                <p>Verification Link/QR Code: [If applicable]</p>
                <div className="verification-link">
                  <label
                    htmlFor="aadhar-verification-link-label"
                    id="aadhar-verification-link-label">
                    -
                  </label>
                </div>
              </div>
              <div className="image-container">
                <img src={aadharImageSrc} alt="Not Uploded" id="aadhar-image" />
              </div>
            </div>
            <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
            </div>
          </div>

          {/* PAN Card */}
        <div className="mcard" id="panid">
          <div className="card">
            <div className="cardinfo">
              <h2>PAN Card</h2>
              <p>PanCard Number:</p>
              <label htmlFor="pan-id-number-label" id="pan-id-number-label">
                -
              </label>
              <p>Issue Date:</p>
              <label htmlFor="pan-issue-date-label" id="pan-issue-date-label">
                -
              </label>
              <p>Verification Link/QR Code: [If applicable]</p>
              <div className="verification-link">
                <label
                  htmlFor="pan-verification-link-label"
                  id="pan-verification-link-label">
                  -
                </label>
              </div>
            </div>
            <div className="image-container">
              <img src={panImageSrc} alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

          {/* Driving License */}
        <div className="mcard" id="dlid">
          <div className="card">
            <div className="cardinfo">
              <h2>Driving License</h2>
              <p>License Number:</p>
              <label htmlFor="license-number-label" id="license-number-label">
                -
              </label>
              <p>Valid From/To: [Validity Dates]</p>
              <label
                htmlFor="license-validity-label"
                id="license-validity-label">
                -
              </label>
              <p>Verification Link/QR Code: [If applicable]</p>
              <div className="verification-link">
                <label
                  htmlFor="license-verification-link-label"
                  id="license-verification-link-label">
                  -
                </label>
              </div>
            </div>
            <div className="image-container">
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

        {/* EDUCATIONAL QUALIFICATIONS */}
        <div className="mcard" id="eqid">
          <div className="card">
            <div className="cardinfo">
              <h2>EDUCATIONAL QUALIFICATIONS</h2>
              <p>Institution Name:</p>
              <label htmlFor="Institution-Name-label" id="Institution-Name-label">
                -
              </label>
              <p>Degree Name</p>
              <label
                htmlFor="Degree-Name-label"
                id="Degree-Name-label">
                -
              </label>
              <p>Year Of Passing</p>
              <label
                  htmlFor="Year-Of-Passing-label"
                  id="Year-Of-Passing-label">
                  -
              </label>
              <p>Honors:</p>
              <label
                  htmlFor="Honors-label"
                  id="Honors-label">
                  -
              </label>
              <p>Distinctions:</p>
              <label
                  htmlFor="Distinctions-label"
                  id="Distinctions-label">
                  -
              </label>
            </div>
            <div className="image-container">
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

        {/* EMPLOYMENT HISTORY */}
        <div className="mcard" id="ehid">
          <div className="card">
            <div className="cardinfo">
              <h2>EMPLOYMENT HISTORY</h2>
              <p>Job Title:</p>
              <label htmlFor="Job-Title-label" id="Job-Title-label">
                -
              </label>
              <p>Company Name</p>
              <label
                htmlFor="Company-Name-label"
                id="Company-Name-label">
                -
              </label>
              <p>Duration</p>
              <label
                  htmlFor="Duration-label"
                  id="Duration-label">
                  -
              </label>
              <p>Description:</p>
              <label
                  htmlFor="Description-label"
                  id="Description-label">
                  -
              </label>
            </div>
            <div className="image-container">
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

         {/* EDUCATIONAL CERTIFICATIONS */}
         <div className="mcard" id="ecid">
          <div className="card">
            <div className="cardinfo">
              <h2>EDUCATIONAL CERTIFICATE</h2>
              <p>Issuing Organization:</p>
              <label htmlFor="Issuing-Organization-label" id="Issuing-Organization-label">
                -
              </label>
              <p>Issuing Date</p>
              <label
                htmlFor="Issuing-Date-label"
                id="Issuing-Date-label">
                -
              </label>

            </div>
            <div className="image-container">
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

         {/* DECLARATION AND DIGITAL SIGNATURE */}
         <div className="mcard" id="dsid">
          <div className="card">
            <div className="cardinfo">
              <h2>DECLARATION AND DIGITAL SIGNATURE</h2>
              <p>Your Digital Signature:</p>
              <label htmlFor="Your-Digital-Signature-label" id="Your-Digital-Signature-label">
                -
              </label>
              <p>Date:</p>
              <label
                htmlFor="Dsing-Date-label"
                id="Dsign-Date-label">
                -
              </label>

            </div>
            <div className="image-container">
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>
          <div className="upbyadhar">
              <p id="upbyadhar">Added On 16-Augus-2023 10:15:00 AM / By Aadhar API</p>

              <p id="upbyzoop">Verified On 16-Augus-2023 10:15:00 AM / By Zoop API</p>
          </div>
        </div>

        {/* PRIVACY STATEMENT AND CONSENT */}
        <div className="mcard">
          <div className="card">
            <div className="cardinfo">
              <h2 className="ph">PRIVACY STATEMENT AND CONSENT</h2>
              <p className="pd">
              A statement about the privacy and use of this document. Consent
              clause for the verifier to use this document for verification
              purposes only.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
  );
};

export default App;
