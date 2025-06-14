import * as bcrypt from "bcryptjs";

export const hashpassword = async (password: string) => {
  const saltrounds = 11;
  const hash: string = await bcrypt.hash(password, saltrounds);
  console.log(typeof hash);

  return hash;
};

export const verifypass = async (password: string, hashedpass: string) => {
  const check = await bcrypt.compare(password, hashedpass);
  return check; //boolean
};

/* export const verifyCookie = (user: any) => {
  return user && user.userID && user.role in ["employee", "user"];
}; */
