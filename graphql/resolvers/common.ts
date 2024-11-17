import bcrypt from "bcryptjs";

export const hashpassword = async (password: string) => {
  const saltrounds = 11;
  const hash: string = await bcrypt.hashSync(password, saltrounds);
  return hash;
};

export const verifypass = async (password: string, hashedpass: string) => {
  const check = await bcrypt.compare(password, hashedpass);
  return check; //boolean
};
