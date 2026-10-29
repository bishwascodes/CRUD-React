import type { Character } from "../types";

type CharacterCardProps = {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
};

// Shows one character and its Edit / Delete buttons
function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{character.name}</h5>
        <p className="mb-1">Class: {character.class}</p>
        <p className="mb-1">Level: {character.level}</p>
        <p className="mb-1">Health: {character.health}</p>
        <p className="mb-3">Mana: {character.mana}</p>

        <button type="button" className="btn btn-primary btn-sm me-2" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default CharacterCard;
