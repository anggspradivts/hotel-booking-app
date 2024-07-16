import { jwtDecode } from "jwt-decode";


interface DecodedTokenProps {
  exp: number;
  [key: string]: any
}
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode<DecodedTokenProps>(token);
    const currentTime = new Date().getTime() / 1000;

    return decodedToken.exp < currentTime
  } catch (error) {
    return true
  }
}