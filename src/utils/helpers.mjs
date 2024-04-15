import bcrypt from "bcrypt";
export function hashedPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
export function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
