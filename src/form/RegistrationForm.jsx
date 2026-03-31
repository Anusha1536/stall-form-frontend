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

  const mapBackendErrors = (payload) => {
    if (!payload || typeof payload !== "object") return {};

    const mappedErrors = {};

    if (Array.isArray(payload.errors)) {
      payload.errors.forEach((item) => {
        if (!item || typeof item !== "object") return;

        const fieldKey = item.path || item.field || item.param;
        const message = item.msg || item.message;

        if (fieldKey && message && !mappedErrors[fieldKey]) {
          mappedErrors[fieldKey] = message;
        }
      });
    }

    if (payload.error && typeof payload.error === "object") {
      Object.entries(payload.error).forEach(([key, value]) => {
        if (typeof value === "string") {
          mappedErrors[key] = value;
        }
      });
    }

    return mappedErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.participantName.trim()) {
      newErrors.participantName = "Participant name is required";
    }

    if (!formData.classDivision.trim()) {
      newErrors.classDivision = "Class / Division is required";
    }

    const cleanedContact = formData.contactNumber.replace(/\D/g, "");
    if (!cleanedContact) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(cleanedContact)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!formData.numberOfBenches) {
      newErrors.numberOfBenches = "Number of benches is required";
    } else if (Number(formData.numberOfBenches) <= 0) {
      newErrors.numberOfBenches = "Number of benches must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Select at least one category";
    }

    if (!formData.stallDescription.trim()) {
      newErrors.stallDescription = "Stall description is required";
    }

    if (!formData.facultyApproval.trim()) {
      newErrors.facultyApproval = "Faculty approval is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTeammateChange = (index, value) => {
    const updated = [...formData.teammates];
    updated[index] = value;
    setFormData({ ...formData, teammates: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      alert("Please correct the highlighted fields and submit again.");
      return;
    }

    try {
      const body = {
        participantName: formData.participantName,
        teammates: formData.teammates,
        classDivision: formData.classDivision,
        contactNumber: formData.contactNumber,
        numberOfBenches: formData.numberOfBenches,
        category: formData.category,
        stallDescription: formData.stallDescription,
        facultyApproval: formData.facultyApproval,
      };

      const res = await axios.post(
        "https://stall-form-backend-production.up.railway.app/stalls/register",
        body
      );

      if (res.status === 201 || res.status === 200) {
        alert("Form submitted successfully.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response);

        if (error.response.status === 400) {
          const backendErrors = mapBackendErrors(error.response.data);

          if (Object.keys(backendErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...backendErrors }));
            alert("Some fields are invalid. Please review and submit again.");
          } else {
            alert(
              error.response.data?.message ||
                "Invalid form data. Please review your entries."
            );
          }
        } else if (error.response.status === 404) {
          alert("Submission endpoint not found.");
        } else if (error.response.status >= 500) {
          alert("Server error. Please try again later.");
        } else {
          alert(error.response.data?.message || "Unable to submit form.");
        }
      } else if (error.request) {
        console.error("No response:", error.request);
        alert("Server not responding. Please check your connection and try again.");
      } else {
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

        <FormField
          id="facultyApproval"
          label="8. Faculty Approval:"
          required
          error={errors.facultyApproval}
        >
          <input
            id="facultyApproval"
            type="text"
            name="facultyApproval"
            value={formData.facultyApproval}
            onChange={handleChange}
            required
            className={errors.facultyApproval ? "error-input" : ""}
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
