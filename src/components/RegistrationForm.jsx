import { useState } from "react";
import axios from "axios";
import "./RegistrationForm.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    participantName: "",
    teammates: ["", "", ""],
    classDivision: "",
    contactNumber: "",
    numberOfBenches: "",
    category: "",
    stallDescription: "",
    facultyApproval: "",
    submissionDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    // console.log(`event trigered from ${e.target.name}`);
    // console.log(`event trigered value ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log("form data",JSON.stringify(formData,null,2));
  };

  const handleTeammateChange = (index, value) => {
    const updated = [...formData.teammates];
    updated[index] = value;
    setFormData({ ...formData, teammates: updated });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!formData.participantName.trim()) {
    newErrors.participantName = "Participant name is required";
  }

  if (!formData.classDivision.trim()) {
    newErrors.classDivision = "Class / Division is required";
  }

  if (!formData.contactNumber.trim()) {
    newErrors.contactNumber = "Contact number is required";
  }

  if (!formData.numberOfBenches) {
    newErrors.numberOfBenches = "Number of benches is required";
  }

  if (!formData.category) {
    newErrors.category = "Select at least one category";
  }

  if (!formData.stallDescription.trim()) {
    newErrors.stallDescription = "Stall description is required";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length !== 0) return;

  try {
    const body = {
      participantName: formData.participantName,
      teammates: formData.teammates,
      classDivision: formData.classDivision,
      contactNumber: formData.contactNumber,
      numberOfBenches: formData.numberOfBenches,
      category: formData.category,
      stallDescription: formData.stallDescription,
      facultyApproval: formData.facultyApproval
    };

    const res = await axios.post(
      "http://localhost:5000/stalls/register",
      body
    );

    // SUCCESS CASE
    if (res.status === 201 || res.status === 200) {
      alert("Form submitted successfully ");
      console.log("Response:", res.data);
    }

  } catch (error) {

    // SERVER RESPONDED WITH ERROR (4xx / 5xx)
    if (error.response) {

      console.error("Server Error:", error.response);

      if (error.response.status === 400) {
        alert("Bad request. Please check form data.");
      }

      else if (error.response.status === 404) {
        alert("API route not found.");
      }

      else if (error.response.status === 500) {
        alert("Server error. Please try again later.");
      }

      else {
        alert(`Error: ${error.response.data.message}`);
      }

    }

    // NO RESPONSE FROM SERVER
    else if (error.request) {
      console.error("No response:", error.request);
      alert("Server not responding. Check backend connection.");
    }

    // REQUEST SETUP ERROR
    else {
      console.error("Axios Error:", error.message);
      alert("Something went wrong.");
    }

  }
};

  return (
    <div className="form-container">
      <h2>Registration Form</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <label>1. Participant's Name:</label>
          <input
            type="text"
            name="participantName" 
            value={formData.participantName}
            onChange={handleChange}
            className={errors.participantName ? "error-input" : ""}
            />

            {errors.participantName && (
            <p className="error-text">{errors.participantName}</p>
            )}
        </div>

        <div className="form-row">
          <label>2. Teammate(s) Name:</label>
          {formData.teammates.map((mate, index) => (
            <input
              key={index}
              type="text"
              value={mate}
              onChange={(e) => handleTeammateChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="form-row">
          <label>3. Class & Division:</label>
          <input
            type="text"
            name="classDivision"
            value={formData.classDivision}
            onChange={handleChange}
            className={errors.classDivision ? "error-input" : ""}
            />

            {errors.classDivision && (
            <p className="error-text">{errors.classDivision}</p>
            )}
        </div>

        <div className="form-row">
          <label>4. Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={errors.contactNumber ? "error-input" : ""}
            />

            {errors.contactNumber && (
            <p className="error-text">{errors.contactNumber}</p>
            )}
        </div>

        <div className="form-row">
          <label>5. No. of Benches Required:</label>
          <input
            type="number"
            name="numberOfBenches"
            value={formData.numberOfBenches}
            onChange={handleChange}
            className={errors.numberOfBenches ? "error-input" : ""}
            />

            {errors.numberOfBenches && (
            <p className="error-text">{errors.numberOfBenches}</p>
            )}
        </div>

        <div className="form-row">
          <label>6. Category (Tick one):</label>

          <div className="checkbox-group">
            <label><input type="radio" name="category" value="Food & Beverage" onChange={handleChange}/> Food & Beverage</label>
            <label><input type="radio" name="category" value="Games" onChange={handleChange}/> Games</label>
            <label><input type="radio" name="category" value="Talent Service" onChange={handleChange}/> Talent Service</label>
            <label><input type="radio" name="category" value="Product Sale" onChange={handleChange}/> Product Sale</label>
            <label><input type="radio" name="category" value="Others" onChange={handleChange}/> Others</label>
          </div>
        </div>

        <div className="form-row">
          <label>
            7. Description of Stall (Briefly explain what you will sell/do):
          </label>
          <textarea
            name="stallDescription"
            value={formData.stallDescription}
            onChange={handleChange}
            className={errors.stallDescription ? "error-input" : ""}
            />

            {errors.stallDescription && (
            <p className="error-text">{errors.stallDescription}</p>
            )}
        </div>

        <div className="form-row">
          <label>8. Faculty Approval:</label>
          <input type="text" name="facultyApproval" onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>9. Last date of submission: 28 / 02 / 2026</label>
        </div>

        <div className="form-row">
          <label>10. Date of submission: 25 / 02 / 2026</label>
        </div>

        <button type="submit">Submit</button>

      </form>
    </div>
  );
}

export default RegistrationForm;
