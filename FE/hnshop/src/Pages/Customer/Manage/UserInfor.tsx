import { useSelector } from "react-redux";
import userModel from "../../../Services/Interfaces/UserModel";
import { RootState } from "../../../Storage/Redux/store";
import React, { useEffect, useState } from "react";
import inputHelper from "../../../Helper/inputHelper";
import { toast } from "react-toastify";
import ManageServices from "../../../Services/Customer/Manage/ManageServices";

const UserInfor = () => {
    const [userInfor, setUserInfor] = useState({
        userName: '',
        name: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        postalCode: '',
    })
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );

    useEffect(() => {
        ManageServices.getUserInfor(userData.id).then((res) => {
            if (res.isSuccess) {
                setUserInfor({
                    userName: res.result.userName,
                    name: res.result.name,
                    phoneNumber: res.result.phoneNumber,
                    streetAddress: res.result.streetAddress,
                    city: res.result.city,
                    postalCode: res.result.postalCode,
                })
            } else {
                alert('cannot fetch')
            }
        })
    }, [userData])

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, userInfor);
        setUserInfor(tempData);
    };

    const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await ManageServices.postChangeUserInfor(userData.id, userInfor.name, userInfor.phoneNumber, userInfor.streetAddress, userInfor.city, userInfor.postalCode).then((res) => {
            console.log(res);
            if (res.isSuccess) {
                setUserInfor({
                    userName: res.result.userName,
                    name: res.result.name,
                    phoneNumber: res.result.phoneNumber,
                    streetAddress: res.result.streetAddress,
                    city: res.result.city,
                    postalCode: res.result.postalCode,
                });
                toast.success("Change account information successfully.", {
                    autoClose: 2000,
                    theme: "colored",
                });
            } else {
                alert('cannot fetch')
            }
        })
    }

    return (
        <div className="">
            <h3>
                Your Account Information
            </h3>
            <hr />
            <form onSubmit={(e) => handleUserSubmit(e)}>
                <div className="w-50 mb-3">
                    <label>Email:    </label>
                    <input className="form-control rounded-0"
                        name='userName'
                        value={userInfor.userName}
                        onChange={(e) => handleUserInput(e)}
                        disabled
                    />
                </div>
                <div className="w-50 mb-3">
                    <label>Name:    </label>
                    <input className="form-control rounded-0"
                        name='name'
                        value={userInfor.name}
                        onChange={(e) => handleUserInput(e)}
                        required />
                </div>
                <div className="w-50 mb-3">
                    <label>Phone Number:    </label>
                    <input className="form-control rounded-0"
                        name='phoneNumber'
                        value={userInfor.phoneNumber}
                        onChange={(e) => handleUserInput(e)}
                        required />
                </div>
                <div className="w-50 mb-3">
                    <label>Street Address:    </label>
                    <input className="form-control rounded-0"
                        name='streetAddress'
                        value={userInfor.streetAddress || ''}
                        onChange={(e) => handleUserInput(e)}
                        required />
                </div>
                <div className="w-50 mb-3">
                    <label>City:    </label>
                    <input className="form-control rounded-0"
                        name='city'
                        value={userInfor.city || ''}
                        onChange={(e) => handleUserInput(e)}
                        required />
                </div>
                <div className="w-50 mb-3">
                    <label>Postal Code:    </label>
                    <input className="form-control rounded-0"
                        name='postalCode'
                        value={userInfor.postalCode || ''}
                        onChange={(e) => handleUserInput(e)}
                        required />
                </div>
                <div className="w-50 text-end">
                    <button type='submit' className="btn btn-dark rounded-0 w-25">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserInfor;