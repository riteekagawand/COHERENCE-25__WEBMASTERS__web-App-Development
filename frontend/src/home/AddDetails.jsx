import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImSpinner2 } from "react-icons/im";
import { userState } from "@/store/auth";
import { useRecoilValue } from "recoil";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AddDetailForm = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const user = useRecoilValue(userState);
  const [showAddDetailsDialog, setShowAddDetailsDialog] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneno: "",
    gender: "",
    dateofbirth: "",
    address: "",
  });
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    if (user && isDetailsIncomplete(user)) {
      setShowAddDetailsDialog(true);
    }
  }, [user]);

  useEffect(() => {
    setIsFormValid(
      !Object.values(formData).some((value) =>
        Array.isArray(value) ? value.length === 0 : !value
      ) && formData.phoneno.length === 10
    );
  }, [formData]);

  const isDetailsIncomplete = (user) => {
    return Object.values({
      phoneno: user.phoneno,
      gender: user.gender,
      dateofbirth: user.dateofbirth,
      address: user.address,
    }).some((value) => !value);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isFormValid) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/adduserdetail`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data?.user));
        toast.success("Details added successfully!");
      }
      setShowAddDetailsDialog(false);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Dialog
        open={showAddDetailsDialog}
        onOpenChange={() => {}}
        closeOnEsc={false}
        closeOnOutsideClick={false}
      >
        <DialogContent
          className="max-w-[90vw] md:max-w-[600px] lg:max-w-[800px] p-6 rounded-lg shadow-lg border overflow-y-auto max-h-[90vh] bg-gray-100"
        >
          <DialogHeader className="mb-6 font-grotesk">
            <DialogTitle className="text-2xl font-bold text-center">
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Please fill out all required fields to continue with careerinsight
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phoneno" className="font-medium text-grotesk">
                  Phone Number
                </Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="flex items-center space-x-2 px-3 py-2 border rounded-md"
                    style={{ borderColor: `var(--borderColor)` }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                      alt="India Flag"
                      className="w-6 h-4 rounded-sm"
                    />
                    <span className="font-medium">+91</span>
                  </div>
                  <Input
                    id="phoneno"
                    name="phoneno"
                    placeholder="Enter your phone number"
                    value={formData.phoneno || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        handleChange({ target: { name: "phoneno", value } });
                      }
                    }}
                    className="inputField flex-1 bg-white text-grotesk"
                    type="number"
                    maxLength="10"
                  />
                </div>
                {formData.phoneno && formData.phoneno.length < 10 && (
                  <p className="text-red-500 text-sm font-semibold text-grotesk">
                    Phone number must be 10 digits
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="gender" className=" text-grotesk font-medium">
                  Gender
                </Label>

                <Select
                  onValueChange={(value) =>
                    handleChange({ target: { name: "gender", value } })
                  }
                  id="gender"
                  name="gender"
                >
                  <SelectTrigger className="inputField text-grotesk">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>

                  <SelectContent className="bg-white text-grotesk"
                  >
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Not to say">Not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-grotesk">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="dateofbirth" className="font-medium">
                  Date of Birth
                </Label>
                <Input
                  id="dateofbirth"
                  name="dateofbirth"
                  onChange={handleChange}
                  className="inputField"
                  type="date"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="address" className="font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  onChange={handleChange}
                  className="inputField"
                />
              </div>
              <div className="flex flex-col space-y-2">
                
              </div>
            </div>
            <DialogFooter className="flex justify-center item-center text-grotesk">
              <Button
                type="button"
                onClick={handleSaveDetails}
                disabled={!isFormValid || loading}
                className="px-6 py-3 text-black bg-green-500 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex flex-row gap-2 items-center border border-red-500">
                    <ImSpinner2 size={20} className="animate-spin" /> Saving
                    your details
                  </div>
                ) : (
                  "Save Details"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDetailForm;
