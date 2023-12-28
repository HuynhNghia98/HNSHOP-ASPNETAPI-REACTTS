import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import AuthServices from "../../Services/Auth/AuthServices";
import userModel from "../../Services/Interfaces/UserModel";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../../Storage/Redux/userAuthSlice";
import { toast } from "react-toastify";
import inputHelper from "../../Helper/inputHelper";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        userName: "",
        password: "",
        confirmPassword: "",
        fullname: "",
        phone: "",
        role: "",
    });

    //errors
    const [usernameError, setUsernameError] = useState<[]>([]);
    const [nameError, setNameError] = useState<[]>([]);
    const [passwordError, setPasswordError] = useState<[]>([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState<[]>([]);
    const [phoneError, setPhoneError] = useState<[]>([]);
    const [roleError, setRoleError] = useState<[]>([]);

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
        setUsernameError([]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(userInput);
        AuthServices.postRegister(userInput?.userName, userInput.password, userInput.confirmPassword, userInput.fullname, userInput.phone, userInput.role).then((res) => {
            console.log(res);
            if (res.isSuccess) {
                const token = res.result.token;
                const { fullName, id, email, role }: userModel = jwtDecode(token);
                localStorage.setItem("token", token);
                dispatch(setLoggedInUser({ fullName, id, email, role }));
                navigate("/");
                toast.success("Successful account registration.", {
                    autoClose: 2000,
                    theme: "colored",
                });
            } else {
                console.log(res);
                setUsernameError(res.Username);
                setNameError(res.Name);
                setPasswordError(res.Password);
                setConfirmPasswordError(res.ConfirmPassword);
                setPhoneError(res.PhoneNumber);
                setRoleError(res.Role);
            }
        })
    }

    return (
        <section className="p-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5 bg-white p-5">
                        <h1 className="mb-3">Register</h1>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 pt-3">
                                <label className="fs-5">Email:</label>
                                <input className="form-control fs-5"
                                    name="userName"
                                    value={userInput.userName}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {usernameError && usernameError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-3 pt-3">
                                <label className="fs-5">Full Name:</label>
                                <input className="form-control fs-5"
                                    name="fullname"
                                    value={userInput.fullname}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {nameError && nameError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-3 pt-3">
                                <label className="fs-5">Phone Number:</label>
                                <input className="form-control fs-5"
                                    name="phone"
                                    value={userInput.phone}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {phoneError && phoneError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-3">
                                <label className="fs-5">Password:</label>
                                <input className="form-control fs-5"
                                    type='password'
                                    name="password"
                                    value={userInput.password}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {passwordError && passwordError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-4    ">
                                <label className="fs-5">Confirm Password:</label>
                                <input className="form-control fs-5"
                                    type='password'
                                    name="confirmPassword"
                                    value={userInput.confirmPassword}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {confirmPasswordError && confirmPasswordError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-4    ">
                                <label className="fs-5">Roles:</label>
                                <select className="form-select fs-5"
                                    name="role"
                                    value={userInput.role}
                                    onChange={(e) => handleUserInput(e)}
                                >
                                    <option>--Select Role--</option>
                                    <option value="Customer">Customer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                {roleError && roleError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-2">
                                <button className="btn btn-dark rounded-0 w-100 fs-5"
                                    type="submit"
                                >Register</button>
                            </div>
                        </form>
                        <div>
                            <Link to="/login" className="text-dark d-block">Login</Link>
                        </div>
                        <hr />
                        <div>
                            <span>Register with:</span>
                            <button className="btn btn-primary ms-3">Facebook</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register