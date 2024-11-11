import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //API Call
        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:8000/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        if (!json.error) {
            //Save the auth-token and redirect
            localStorage.setItem('token', json.data);
            navigate("/");
            props.showAlert("Account Created Successfully", "success");
        } else {
            props.showAlert("Invalid Details", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const googleAuth = () => {
        window.open(
            `http://localhost:8000/auth/google/`,
            "_self"
        );
    };
    return (
        <div className='container'>
            <div className="col-md-8 mx-auto">
                <h2 className='my-3 text-primary'>Signup</h2>
                <form className='border border-primary rounded' onSubmit={handleSubmit}>
                    <div className="form-group mx-3 my-3 mt-5">
                        {/* <label htmlFor="name">Name</label> */}
                        <input placeholder='Full Name' type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group mx-3 my-2">
                        {/* <label htmlFor="email">Email address</label> */}
                        <input placeholder="Email" type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group mx-3 my-2">
                        {/* <label htmlFor="password">Password</label> */}
                        <input placeholder='Password' type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
                    </div>
                    <div className="form-group mx-3 my-2">
                        {/* <label htmlFor="cpassword">Confirm Password</label> */}
                        <input placeholder='Confirm Password' type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
                    </div>

                    <div className="d-flex justify-content-center">

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                    <div className="d-flex justify-content-center">

                        <p className="form-group my-3">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                    <div className="d-flex justify-content-center">

                        <button className="btn btn-primary mb-4" onClick={googleAuth}>
                            <span>Signup with <b>Google</b></span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Signup
