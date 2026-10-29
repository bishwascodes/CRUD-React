import { useEffect, useState } from "react";
import type { Character, CharacterFormData } from "./types";
import CharacterCard from "./components/CharacterCard";
import CharacterForm from "./components/CharacterForm";

// Backend URL 
const apiURL = "https://localhost:7147/api/characters";

// Starting values for the "Create" form
const emptyCharacter: CharacterFormData = {
  name: "",
  class: "",
  level: 0,
  health: 0,
  mana: 0,
};

// Reads the real error message the backend sent back.
async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    console.log(data)

    // Our own validation errors: { error: "Invalid character class." }
    if (data.error) {
      return data.error;
    }

    // backend errors from ASP.Net itself: { errors: { Level: ["The field Level must be between 1 and 50."] } }
    if (data.errors) {
      const messages: string[] = [];
      for (const field in data.errors) {
        messages.push(...data.errors[field]);
      }
      return messages.join(" ");
    }

    // server errors (500): { message: "...", detail: "..." }
    if (data.message) {
      return data.message;
    }
  } catch {
    
  }

  return `Request failed with status ${response.status}`;
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [editingId, setEditingId] = useState<string | null>(null); // which character is being edited

  // GET - runs once when the app first opens
  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await fetch(apiURL);

        if (!response.ok) {
          setError(await getErrorMessage(response));
          return;
        }

        const data: Character[] = await response.json();
        setCharacters(data);
      } catch {
        // fetch() itself throws if the server can't be reached
        setError("Could not connect to the server.");
      } finally {
        // Runs whether it worked or failed, so the loading message always goes away
        setLoading(false);
      }
    }

    loadCharacters();
  }, []);

  // POST Request
  async function createCharacter(newCharacter: CharacterFormData): Promise<string> {
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter),
      });

      if (!response.ok) {
        return await getErrorMessage(response);
      }

      // The API sends back the new character (with its new id)
      const created: Character = await response.json();
      setCharacters([...characters, created]);
      return ""; // no error
    } catch {
      return "Could not connect to the server.";
    }
  }

  // PUT Request
  async function updateCharacter(id: string, updatedData: CharacterFormData): Promise<string> {
    try {
      const response = await fetch(`${apiURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // The backend requires the id in the body to match the id in the URL
        body: JSON.stringify({ id: id, ...updatedData }),
      });

      if (!response.ok) {
        return await getErrorMessage(response);
      }

      const getResponse = await fetch(`${apiURL}/${id}`);
      const savedCharacter: Character = await getResponse.json();

      // Replace the old character in the list with the updated one
      setCharacters(characters.map((c) => (c.id === id ? savedCharacter : c)));
      setEditingId(null); // close the edit form
      return "";
    } catch {
      return "Could not connect to the server.";
    }
  }

  // DELETE Request
  async function deleteCharacter(id: string) {
    setError("");

    try {
      const response = await fetch(`${apiURL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      // Remove the deleted character from the list
      setCharacters(characters.filter((c) => c.id !== id));
    } catch {
      setError("Could not connect to the server.");
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 fw-semibold text-center">Character Manager</h1>

      {/* Error message for loading / deleting */}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      <h2 className="h4 mb-3">Create a Character</h2>
      <div className="row mb-5">
        <div className="col-md-6 col-lg-4">
          <CharacterForm initialData={emptyCharacter} buttonText="Create" onSubmit={createCharacter} />
        </div>
      </div>

      <h2 className="h4 mb-3">All Characters</h2>

      {/* Loading state: Bootstrap spinner */}
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border text-primary" role="status"></div>
          <span>Loading characters...</span>
        </div>
      )}

      {!loading && characters.length === 0 && <p className="text-muted">No characters found.</p>}

    
      <div className="row g-3">
        {characters.map((character) => (
          // The key goes on the outer div now, because that's what .map() returns
          <div key={character.id} className="col-12 col-sm-6 col-lg-4">
            {/* If this character is being edited, show the form. Otherwise show the card. */}
            {editingId === character.id ? (
              <CharacterForm
                initialData={character}
                buttonText="Save"
                onSubmit={(data) => updateCharacter(character.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <CharacterCard
                character={character}
                onEdit={() => setEditingId(character.id)}
                onDelete={() => deleteCharacter(character.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
