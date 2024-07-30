interface InputProps {
  type: string;
  placeholder: string;
}
const input = ({ type, placeholder }: InputProps) => {
  return ( 
    <input type={type} placeholder={placeholder} />
   );
}
 
export default input;