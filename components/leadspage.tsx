"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { useStore } from "@/lib/zustand/store";
import LoadingBrackets from "@/components/ui/loading-brackets";
import { convertToWebP } from "@/utils/webpImages";

interface Lead {
  id?:string;
  name: string;
  position: string;
  organization: string;
  additionalInfo: string;
  imageUrl: string;
}

const Leads: React.FC = () => {
  const [loading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // const [isLoggedInLoggedIn, setLoggedInLoggedIn] = useState(false);
  const { isLoggedIn , setLoggedIn } = useStore();
  const [currentLeads, setCurrentLeads] = useState<Lead[]>([]);
  const [alumniLeads, setAlumniLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null); // For editing leads
  const { image } = useStore();

  // Fetch leads from Firestore
  const fetchLeads = async () => {
    try {
      const resp = await fetch("/api/leads");
      const data = await resp.json();
      const currentLeads = data.currentLeads;
      const alumniLeads = data.alumniLeads;
      setCurrentLeads(currentLeads);
      setAlumniLeads(alumniLeads);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    });
  }, [isLoggedIn]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddOrEditLead = async (selectedLead: Lead) => {
    if (!selectedLead?.name || !selectedLead?.position) {
      console.error(
        "Validation failed: Missing required fields (Name and Position)"
      );
      alert("Please fill in all required fields (Name and Position).");
      return;
    }

    try {
      let imageUrl = selectedLead.imageUrl;

      if (selectedLead.imageUrl && selectedLead.imageUrl.startsWith("blob")) {
        console.log(
          "Image file detected, preparing for upload to Cloudinary Storage..."
        );

        // Create a new FormData object
        const formData = new FormData();
        if (image) {
          formData.append("file", image);
          formData.append("name", selectedLead.name);
        }

        const response = await fetch("/api/leads/upload", {
          method: "POST",
          body: formData, // FormData automatically sets the correct headers
        });

        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.error("Failed to parse JSON response:", error);
          throw new Error("Unexpected response from the server");
        }
        imageUrl = data.imageUrl;
        if (!response.ok) {
          console.error("Error uploading file:", data);
          throw new Error(data.message || "Error uploading file");
        }
        console.log("Image uploaded successfully, URL:", imageUrl);
      }

      const leadData = {
        ...selectedLead,
        imageUrl: imageUrl, // Ensure the Cludinary URL is used
      };

      if (selectedLead.id) {
        // Update lead in Firestore
        try {
          await fetch(`/api/leads/?id=${selectedLead.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(leadData),
          });
        } catch (error) {
          console.error("Error updating lead:", error);
          alert(
            "An error occurred while updating the lead. Check the console for details."
          );
        }
        alert("Lead updated successfully");
      } else {
        // Add new lead to Firestore
        try {
          await fetch("/api/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(leadData),
          });
          alert("Lead added successfully");
        } catch (error) {
          console.error("Error adding lead:", error);
          alert(
            "An error occurred while adding the lead. Check the console for details."
          );
        }
      }

      setShowForm(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch (error) {
      console.error("Error in handleAddOrEditLead:", error);
      alert(
        "An error occurred while adding/updating the lead. Check the console for details."
      );
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await fetch(`/api/leads/?id=${id}`, {
        method: "DELETE",
      });
      alert("Lead deleted successfully");
      await fetchLeads(); // Refresh leads after deleting
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("An error occurred. Check the console for details.");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedLead(null); // Reset form for new lead
  };

  return (
    <section
      style={{
        textAlign: "center",
        padding: "2rem 0",
        backgroundColor: "#000000",
        color: "#fff",
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingBrackets />
        </div>
      ) : (
        <>
          {isLoggedIn && (
            <button
              onClick={toggleForm}
              style={{
                position: "fixed",
                top: "85px",
                right: "85px",
                padding: "10px 20px",
                backgroundColor: "#00ff33",
                color: "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              {selectedLead ? "Edit Lead" : "Add Lead"}
            </button>
          )}

          {showForm && (
            <LeadForm
              closeForm={toggleForm}
              selectedLead={selectedLead}
              handleAddOrEditLead={handleAddOrEditLead}
            />
          )}

          <LeadSection
            title="Current Leads"
            leads={currentLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            isLoggedInLoggedIn={isLoggedIn}
          />
          <LeadSection
            title="Alumni Leads"
            leads={alumniLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            isLoggedInLoggedIn={isLoggedIn}
          />
        </>
      )}
    </section>
  );
};

interface LeadSectionProps {
  title: string;
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isLoggedInLoggedIn: boolean; // Added prop to handle admin check
}

const LeadSection: React.FC<LeadSectionProps> = ({
  title,
  leads,
  onEdit,
  onDelete,
  isLoggedInLoggedIn,
}) => (
  <div style={{ padding: "1rem", marginTop: "2rem" }}>
    <h3
      style={{
        textAlign: "center",
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        borderBottom: "2px solid #000000",
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
      }}
    >
      {title}
    </h3>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {leads.map((lead) => (
        <div
          key={lead.id}
          style={{
            backgroundImage: convertToWebP(`url(${lead.imageUrl})`),
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "15px",
            height: "325px",
            width: "250px",
            position: "relative",
            overflow: "hidden",
            cursor: isLoggedInLoggedIn ? "pointer" : "default", // Change cursor if admin is logged in
          }}
          onMouseEnter={(e) =>
            isLoggedInLoggedIn && (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            isLoggedInLoggedIn && (e.currentTarget.style.transform = "scale(1)")
          }
          onClick={() => isLoggedInLoggedIn && onEdit(lead)} // Only allow edit on click if admin
        >
          <div
            style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              padding: "1rem",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0", fontSize: "1.2rem", fontWeight: "bold" }}>
              {lead.name}
            </h3>
            <p style={{ margin: "0", fontSize: "1rem" }}>{lead.organization}</p>
            <p style={{ margin: "0", fontSize: "1rem" }}>
              {lead.additionalInfo}
            </p>
            {isLoggedInLoggedIn && (
              <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.id) {
                  onDelete(lead.id);
                } else {
                  console.error('Lead id is undefined');
                }
              }}
              
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  marginTop: "0.5rem",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface LeadFormProps {
  closeForm: () => void;
  selectedLead: Lead | null;
  handleAddOrEditLead: (lead: Lead) => Promise<void>;
}

const LeadForm: React.FC<LeadFormProps> = ({
  closeForm,
  selectedLead,
  handleAddOrEditLead,
}) => {
  const [lead, setLead] = useState<Lead>(
    selectedLead || {
      
      name: "",
      position: "",
      organization: "",
      additionalInfo: "",
      imageUrl: "",
    }
  );
  const { setImage } = useStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setLead((prevLead) => ({
      ...prevLead,
      [name]: value, // Dynamically update the field based on input 'name'
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      setLead((prevLead) => ({
        ...prevLead,
        imageUrl: URL.createObjectURL(file),
      }));
    } else {
      console.error("No file selected or invalid file input");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddOrEditLead(lead); // Call onLeadUpdate to refresh the leads
    closeForm(); // Close the form after submission
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001,
        padding: "2rem",
        paddingTop: "0.5rem",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "400px",
        maxWidth: "90%",
        maxHeight: "90vh",
        color: "black",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#000000",
          // marginBottom: '1rem',
          marginTop: "0px",
        }}
      >
        {selectedLead ? "Edit Lead" : "Add Lead"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              fontSize: "1rem",
              // marginBottom: '0.5rem',
              color: "#333",
            }}
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={lead.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              // padding: '0.5rem',
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="position">Position:</label>
          <select
            id="position"
            name="position"
            value={lead.position}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select Position</option> {/* Placeholder option */}
            <option value="Alumni">Alumni</option>
            <option value="Current">Current</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="organization"
            style={{
              display: "block",
              fontSize: "1rem",
              // marginBottom: '0.5rem',
              color: "#333",
            }}
          >
            Organization:
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={lead.organization}
            onChange={handleChange}
            style={{
              width: "100%",
              // padding: '0.5rem',
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="additionalInfo"
            style={{
              display: "block",
              fontSize: "1rem",
              // marginBottom: '0.5rem',
              color: "#333",
            }}
          >
            Additional Info:
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={lead.additionalInfo}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="image"
            style={{
              display: "block",
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#333",
            }}
          >
            Image:
          </label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {/* {lead.imageUrl && ( */}
          {/* <div style={{ marginTop: '1rem' }}>
              <img src={lead.imageUrl} alt="Selected" style={{ maxWidth: '100%', borderRadius: '5px' }} />
            </div>
          // )} */}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#00ff33",
            color: "#000000",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          {selectedLead ? "Update Lead" : "Add Lead"}
        </button>
      </form>
      <button
        onClick={closeForm}
        style={{
          backgroundColor: "#999",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          marginTop: "1rem",
          width: "100%",
          fontSize: "1rem",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default Leads;
