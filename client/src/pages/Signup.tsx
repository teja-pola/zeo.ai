import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to roll page when this component is accessed directly
    navigate("/roll");
  }, [navigate]);

  return null;
};

export default Signup;
