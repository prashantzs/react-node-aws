import { useState } from 'react';

export default function useForm(initial = {}) {
    const [inputs, setInputs] = useState(initial);

    function handleChange(e) {
        let {value, name, type} = e.target;

        setInputs({
            ...inputs,
            [name]: value
        })
    }

    return {
        inputs,
        setInputs,
        handleChange
    }
}