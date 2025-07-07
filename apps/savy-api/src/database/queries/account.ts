export const GET_ACCOUNT_BY_NAME = `
  SELECT * FROM accounts
  WHERE name = $1
`;

export const INSERT_ACCOUNT = `
  INSERT INTO accounts (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING id, name, email, password
`;

