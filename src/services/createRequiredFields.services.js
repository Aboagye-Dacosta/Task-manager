const { v4: uuidv4 } = require("uuid");

function createdRequired() {
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  const id = uuidv4();

  return {
    id,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

module.exports = createdRequired;
