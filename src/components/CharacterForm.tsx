import { useState } from "react";
import type { CharacterFormData } from "../types";

type CharacterFormProps = {
  initialData: CharacterFormData;
  buttonText: string; // "Create" or "Save"
  onSubmit: (data: CharacterFormData) => Promise<string>;
  onCancel?: () => void; 
};

// One form that is used for BOTH creating and editing a character
function CharacterForm({ initialData, buttonText, onSubmit, onCancel }: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterFormData>(initialData);
  const [error, setError] = useState("");

  // Click on the Create / Save button
  async function handleSubmit() {
    const errorMessage = await onSubmit(formData);
    setError(errorMessage);

    // If it worked, reset the form back to the starting values
    if (errorMessage === "") {
      setFormData(initialData);
    }
  }

  return (
    <form className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Plain text input on purpose, so we can see the API reject a bad class */}
        <div className="mb-2">
          <label className="form-label">Class</label>
          <input
            className="form-control"
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Level</label>
          {/* Number() converts the typed text into a number */}
          <input
            className="form-control"
            type="number"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Health</label>
          <input
            className="form-control"
            type="number"
            value={formData.health}
            onChange={(e) => setFormData({ ...formData, health: Number(e.target.value) })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mana</label>
          <input
            className="form-control"
            type="number"
            value={formData.mana}
            onChange={(e) => setFormData({ ...formData, mana: Number(e.target.value) })}
          />
        </div>

        {/* Show the error message from the backend */}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button type="button" className="btn btn-success me-2" onClick={handleSubmit}>
          {buttonText}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CharacterForm;
