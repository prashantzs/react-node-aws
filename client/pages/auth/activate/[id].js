import {useEffect, useState} from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {showSuccessMessage, showErrorMessage} from '../../../libs/alert';
import Layout from '../../../components/Layout';
import {withRouter} from 'next/router';

const ActivateAccount = ({router}) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: ''
    });

    const {name, token, buttonText, success, error} = state;

    useEffect(() => {
        let token = router.query.id;

        if(token) {
            const {name} = jwt.decode(token);
            setState({
                ...state,
                name,
                token
            })
        }
    }, [router]);

    const clickSubmit = async (e) => {
        e.preventDefault();

        setState({
            ...state,
            buttonText: 'Activating'
        })

        try {
            const response = await axios.post(`${process.env.API}/register/activate`, {
                token
            });

            console.log('Account activate response: ', response);

            setState({
                ...state,
                name: '',
                token: '',
                buttonText: 'Activated',
                success: response.data.message
            })

        } catch (error) {
            console.log('Account activate error response: ', error);

            setState({
                ...state,
                name: '',
                token: '',
                buttonText: 'Activation Failed',
                error: error.response.data.message,
                success: ''
            })
        }
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Hello {name}, Ready to activate your account?</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    <button className="btn btn-outline-primary btn-block" onClick={clickSubmit}>{buttonText}</button>
                </div>
            </div>
        </Layout>
    )
}

export default withRouter(ActivateAccount);