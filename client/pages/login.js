import {useEffect, useState} from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import useForm from '../libs/useForm';
import {showSuccessMessage, showErrorMessage} from '../libs/alert'
import Layout from '../components/Layout';

export default function Login() {

    const {inputs, setInputs, handleChange} = useForm({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Sign in'
    });

    const {email, password} = inputs;

    const handleSubmitAsync = async (e) => {
        e.preventDefault();
        
        setInputs({
            ...inputs,
            buttonText: 'Signing in'
        });

        try {
            const response = await axios.post(`${process.env.API}/login`, {
                email,
                password
            });

            setInputs({
                ...inputs,
                email: '',
                password: '',
                error: '',
                buttonText: 'Submitted',
                success: response.data.message
            });

        } catch (error) {
            setInputs({
                ...inputs,
                buttonText: 'Register',
                success: '',
                error: error.response.data.error
            });
        }
    }

    const loginForm = () => {
        return (
            <>
            <form onSubmit={handleSubmitAsync}>
                <div className="mb-3">
                    <label htmlFor="formGroupEmail" className="form-label">Email</label>
                    <input 
                        type="email"
                        name="email"
                        className="form-control" 
                        id="formGroupEmail"
                        value={inputs.email}
                        onChange={handleChange}
                        placeholder="Type your email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="formGroupPassword" className="form-label">Password</label>
                    <input 
                        type="password"
                        name="password"
                        className="form-control" 
                        id="formGroupPassword"
                        value={inputs.password}
                        onChange={handleChange}
                        placeholder="Type your password"/>
                </div>
                <div className="col-12">
                    <button 
                        type="submit" 
                        className="btn btn-primary">
                        {inputs.buttonText}
                    </button>
                </div>
            </form>
            </>
        )
    }

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Login</h1>
                <br />
                {inputs.success && showSuccessMessage(inputs.success)}
                {inputs.error && showErrorMessage(inputs.error)}
                {loginForm()}
            </div>
        </Layout>
    );
}