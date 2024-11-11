import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //API Call
        const response = await fetch("http://localhost:8000/loginuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        if (!json.error) {
            //Save the auth-token and redirect
            localStorage.setItem('token', json.data);
            props.showAlert("Logged In Successfully", "success");
            navigate("/");

        } else {
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const googleAuth = () => {

        try {
            window.open(
                `http://localhost:8000/auth/google/`,
                "_blank"
            );
            navigate("/")
        } catch (error) {
            console.error(error)
        }

    };

    return (
        <div className='mt-5'>
            <div className="col-md-8 mx-auto">
                <h2 className='text-primary my-3'>Login</h2>
                <form className="border border-primary rounded" onSubmit={handleSubmit}>
                    <div className="form-group mx-3 my-3 mt-5">
                        {/* <label htmlFor="email">Email address</label> */}
                        <input type="email" className="form-control" value={credentials.email}
                            placeholder="Email" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                        {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                    </div>
                    <div className="form-group mx-3 my-2">
                        {/* <label htmlFor="password">Password</label> */}
                        <input type="password" placeholder='Password' className="form-control" value={credentials.password} id="password" name='password' onChange={onChange} />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary" >Login</button>
                    </div>

                    <div className="d-flex justify-content-center">
                        <p className="form-group my-3">
                            Don't have an account? <Link to="/signup">Signup</Link>
                        </p>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary mb-4" onClick={googleAuth}>
                            <span>Login with <b>Google</b></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
