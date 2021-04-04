import axios from 'axios';
import useForm from '../libs/useForm';
import {showSuccessMessage, showErrorMessage} from '../libs/alert'
import Layout from '../components/Layout';
export default function Register() {

    const {inputs, setInputs, handleChange} = useForm({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register'
    });

    const {name, email, password} = inputs;

    const handleSubmitAsync = async (e) => {
        e.preventDefault();
        
        setInputs({
            ...inputs,
            buttonText: 'Registering'
        });

        try {
            const response = await axios.post(`${process.env.API}/register`, {
                name,
                email,
                password
            });

            setInputs({
                ...inputs,
                name: '',
                email: '',
                password: '',
                error: '',
                buttonText: 'Signing in',
                success: response.data.message
            });

        } catch (error) {
            setInputs({
                ...inputs,
                buttonText: 'Login',
                success: '',
                error: error.response.data.error
            });
        }
    }

    const registerForm = () => {
        return (
            <>
            <form onSubmit={handleSubmitAsync}>
                <div className="mb-3">
                    <label htmlFor="formGroupName" className="form-label">Name</label>
                    <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        id="formGroupName"
                        value={inputs.name}
                        onChange={handleChange}
                        placeholder="Type your name"/>
                </div>
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
                <h1>Register</h1>
                <br />
                {inputs.success && showSuccessMessage(inputs.success)}
                {inputs.error && showErrorMessage(inputs.error)}
                {registerForm()}
                <br />
                {JSON.stringify(inputs)}
            </div>
        </Layout>
    );
}