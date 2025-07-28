import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/user/profile.api.js";
import { login } from "../store/slices/AuthSlice.js";

const GithubCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        console.log("Github auth response: ", response);
        if ([200, 201].includes(response.statuscode)) {
          dispatch(login({ userData: response }));
          setLoading(false);
          navigate("/");
        } else {
          setLoading(false);
          navigate("/auth");
        }
      } catch (error) {
        console.error("GitHub login failed:", error);
        navigate("/auth");
      }
    };

    handleAuth();
  }, []);

  return (
    <div>
      {loading && (
        <p className="text-center mt-20">Authenticating with GitHub...</p>
      )}
    </div>
  );
};

export default GithubCallback;
