import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Label } from "../ui/Label.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { updateUserDetails } from "../../services/user/profile.api.js";
import successToast from "../../utils/notification/success.js";
import errorToast from "../../utils/notification/error.js";
import { login as storeLogin } from "../../store/AuthSlice.js";

const ProfileInfoUpdateForm = () => {
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.data?.fullname || "");
      setEmail(user.data?.email || "");
    }
  }, [user]);

  const isNameChanged = name.trim() !== (user?.data?.fullname?.trim() || "");
  const isEmailChanged = email.trim() !== (user?.data?.email?.trim() || "");
  const isFormChanged = isNameChanged || isEmailChanged;

  const handleSubmit = async () => {
    setIsUpdating(true);
    const res = await updateUserDetails({ fullname: name, email });

    if (res.statuscode !== 200) {
      setIsUpdating(false);
      errorToast("Failed to update your details. Please try again");
      return;
    }
    dispatch(storeLogin({ userData: res }));
    setName(res.data?.fullname);
    setEmail(res.data?.email);
    setIsUpdating(false);
    successToast("Your details updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your name and email address</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <Button type="submit" disabled={isUpdating || !isFormChanged}>
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoUpdateForm;
