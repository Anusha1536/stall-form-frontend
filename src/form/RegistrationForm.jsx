import { useState } from "react";
import axios from "axios";
import "./RegistrationForm.css";
import FormPageLayout from "./components/FormPageLayout";
import FormField from "./components/FormField";

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
      "https://stall-form-backend-production.up.railway.app/stalls/register",
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
    <FormPageLayout
      title="Registration Form"
      subtitle="Complete all required details to register your stall."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          id="participantName"
          label="1. Participant's Name:"
          required
          error={errors.participantName}
        >
          <input
            id="participantName"
            type="text"
            name="participantName"
            value={formData.participantName}
            onChange={handleChange}
            required
            className={errors.participantName ? "error-input" : ""}
          />
        </FormField>

        <FormField id="teammates" label="2. Teammate(s) Name:">
          {formData.teammates.map((mate, index) => (
            <input
              key={index}
              id={`teammate-${index + 1}`}
              type="text"
              value={mate}
              onChange={(e) => handleTeammateChange(index, e.target.value)}
              placeholder={`Teammate ${index + 1}`}
            />
          ))}
        </FormField>

        <FormField
          id="classDivision"
          label="3. Class & Division:"
          required
          error={errors.classDivision}
        >
          <input
            id="classDivision"
            type="text"
            name="classDivision"
            value={formData.classDivision}
            onChange={handleChange}
            required
            className={errors.classDivision ? "error-input" : ""}
          />
        </FormField>

        <FormField
          id="contactNumber"
          label="4. Contact Number:"
          required
          error={errors.contactNumber}
        >
          <input
            id="contactNumber"
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className={errors.contactNumber ? "error-input" : ""}
          />
        </FormField>

        <FormField
          id="numberOfBenches"
          label="5. No. of Benches Required:"
          required
          error={errors.numberOfBenches}
        >
          <input
            id="numberOfBenches"
            type="number"
            name="numberOfBenches"
            value={formData.numberOfBenches}
            onChange={handleChange}
            required
            className={errors.numberOfBenches ? "error-input" : ""}
          />
        </FormField>

        <FormField
          id="category"
          label="6. Category (Tick one):"
          required
          error={errors.category}
        >
          <div className="checkbox-group" role="radiogroup" aria-label="Stall category">
            <label>
              <input
                type="radio"
                name="category"
                value="Food & Beverage"
                checked={formData.category === "Food & Beverage"}
                onChange={handleChange}
                required
              />
              Food & Beverage
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="Games"
                checked={formData.category === "Games"}
                onChange={handleChange}
                required
              />
              Games
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="Talent Service"
                checked={formData.category === "Talent Service"}
                onChange={handleChange}
                required
              />
              Talent Service
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="Product Sale"
                checked={formData.category === "Product Sale"}
                onChange={handleChange}
                required
              />
              Product Sale
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="Others"
                checked={formData.category === "Others"}
                onChange={handleChange}
                required
              />
              Others
            </label>
          </div>
        </FormField>

        <FormField
          id="stallDescription"
          label="7. Description of Stall (Briefly explain what you will sell/do):"
          required
          error={errors.stallDescription}
        >
          <textarea
            id="stallDescription"
            name="stallDescription"
            value={formData.stallDescription}
            onChange={handleChange}
            required
            className={errors.stallDescription ? "error-input" : ""}
          />
        </FormField>

        <FormField id="facultyApproval" label="8. Faculty Approval:">
          <input
            id="facultyApproval"
            type="text"
            name="facultyApproval"
            value={formData.facultyApproval}
            onChange={handleChange}
          />
        </FormField>

        <div className="form-row form-meta-row">
          <p>9. Last date of submission: 28 / 02 / 2026</p>
          <p>10. Date of submission: 25 / 02 / 2026</p>
        </div>

        <button type="submit">Submit</button>
      </form>
    </FormPageLayout>
  );
}

export default RegistrationForm;
