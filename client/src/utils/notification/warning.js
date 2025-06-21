import { toast, Bounce } from "react-toastify";

const warningToast = (message) => {
  return toast.warn(message, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

export default warningToast;
