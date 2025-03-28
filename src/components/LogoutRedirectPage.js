import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const brandURLs = {
    "z3ntscap.tstechlab.com": "https://z3ntscap.tstechlab.com",
    "z3ntsiron.tstechlab.com": "https://z3ntsiron.tstechlab.com",
    //"z3ntsthor.tstechlab.com": "https://0d0d-13-229-18-8.ngrok-free.app/tscaploginpage",
    "z3ntsthor.tstechlab.com": "https://z3ntsthor.tstechlab.com/access/normal"
};

const LogoutRedirectPage = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('return_to');

        if (returnTo) {
            for (const [key, value] of Object.entries(brandURLs)) {
                if (returnTo.includes(key)) {
                    window.location.href = value + "?return_to=" + encodeURIComponent(returnTo);
                    return;
                }
            }
        }
    }, [location]);

    return null;
};

export default LogoutRedirectPage;