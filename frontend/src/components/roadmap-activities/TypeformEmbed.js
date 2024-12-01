import React, { useEffect } from 'react';

const TypeformEmbed = ({ formId }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://embed.typeform.com/next/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            data-tf-live={formId}
            style={{ width: '100%', height: '600px' }}
        ></div>
    );
};

export default TypeformEmbed;