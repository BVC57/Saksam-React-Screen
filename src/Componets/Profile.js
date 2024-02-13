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
  const [ProfileImagesrc, setProfileImagesrc] = useState("");

  // useEffect to make the API call when the component mounts
  useEffect(() => {
    console.log("API is calling");

    const makeAPICall = async () => {
      setLoading(true);
      try {
        // Make API call
        const response = await fetch(
          `https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/get_viewer_attribute_list?id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization:
              `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

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
        console.error("Error fetching data from API:",error);
        setLoading(false);
        setError(true);
      }
    };

    makeAPICall();
  }, [null]);

  // Function to set label data based on the API response
  const setDataLabels = (data) => {
    console.log("data message:--","******************[",data.message,"]*********************")
    if (data !== null) {
      // Set personal information
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
        data.data.aadhaarcard &&
        Array.isArray(data.data.aadhaarcard) &&
        data.data.aadhaarcard.length > 0
      ) {
        setLabelData(
          "aadhar-id-number-label",
          data.data.aadhaarcard[0].aadhaar_number || "-"
        );
        setLabelData(
          "aadhar-issue-date-label",
          data.data.aadhaarcard[0].issueDate || "-"
        );
        setLabelData(
          "aadhar-verification-link-label",
          data.data.aadhaarcard[0].verificationLink || "-"
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

      // Check PAN Card data
      if (
        data.data &&
        data.data.pancard &&
        Array.isArray(data.data.pancard) &&
        data.data.pancard.length > 0
      ) {
        setLabelData(
          "pan-id-number-label",
          data.data.pancard[0].aadhaar_number || "-"
        );
        setLabelData(
          "pan-issue-date-label",
          data.data.pancard[0].issueDate || "-"
        );
        setLabelData(
          "pan-verification-link-label",
          data.data.pancard[0].verificationLink || "-"
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

      // Check Driving License data
      if (
        data.data &&
        data.data.drivinglicense &&
        Array.isArray(data.data.drivinglicense) &&
        data.data.drivinglicense.length > 0
      ) {
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
    }else{
      console.log("data is empty")
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

      <div className="main" style={{ display: loading ||error ? "none" : "block"}}>
        <div className="aphead">
          <h1>VERIFIABLE CREDENTIALS PROFILE</h1>
          <h2 id="full-name-label">-</h2>
          <div className="profileimg">
            <img src={ProfileImagesrc} alt="Not Uploded" id="aadhar-image" />
            {/* <img src="Images/pp.JPG" alt="" /> */}
          </div>
        </div>
        <hr />

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
          <div className="card">
            {/* Aadhar Card */}
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

          {/* PAN Card */}
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
              <img src="" alt="Not Uploded" id="aadhar-image" />
            </div>
          </div>

          {/* Driving License */}
          <div className="card">
            <div className="cardinfo">
              <h2>Driving License</h2>
              <p>License Number:</p>
              <label htmlFor="license-number-label" id="license-number-label">
                -
              </label>
              <p>Valid From/To: [Enter Validity Dates]</p>
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
        </div>
      </div>
    </div>
  );
};

export default App;
