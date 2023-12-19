import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import inputHelper from "../../Helper/inputHelper";
import AuthServices from "../../Services/Auth/AuthServices";
import userModel from "../../Services/Interfaces/UserModel";
import { setLoggedInUser } from "../../Storage/Redux/userAuthSlice";
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

const Login = () => {
    const [userInput, setUserInput] = useState({
        userName: "",
        password: "",
    });
    const [usernameError, setUsernameError] = useState<[]>([]);
    const [passwordError, setPasswordError] = useState<[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
        setUsernameError([]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        AuthServices.postLogin(userInput.userName, userInput.password).then((res) => {
            console.log(res);
            if (res.isSuccess) {
                const token = res.result.token;
                const { fullName, id, email, role }: userModel = jwtDecode(token);
                localStorage.setItem("token", token);
                dispatch(setLoggedInUser({ fullName, id, email, role }));
                navigate("/");
                toast.success("Successfully logged in to your account.", {
                    autoClose: 2000,
                    theme: "colored",
                });
            } else {
                console.log(res);
                setUsernameError(res.Username);
                setPasswordError(res.Password);
            }
        })
    }

    return (
        <section className="p-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5 bg-white p-5">
                        <h1 className="mb-3">Login</h1>
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
                            <div className="mb-3">
                                <label className="fs-5">Password:</label>
                                <input className="form-control fs-5"
                                    name="password"
                                    value={userInput.password}
                                    onChange={(e) => handleUserInput(e)}
                                />
                                {passwordError && passwordError.map((error, index) => (
                                    <span className="text-danger" key={index}>{error}</span>
                                ))}
                            </div>
                            <div className="mb-2">
                                <button className="btn btn-dark rounded-0 w-100 fs-5"
                                    type="submit"
                                >Login</button>
                            </div>
                        </form>
                        <div>
                            <Link to="/register" className="text-dark d-block">Register</Link>
                            <Link to="/register" className="text-dark d-block">Forgot password?</Link>
                        </div>
                        <hr />
                        <div>
                            <span>Login with:</span>
                            <button className="btn btn-primary ms-3">Facebook</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;