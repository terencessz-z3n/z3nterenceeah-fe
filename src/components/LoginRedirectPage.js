import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const brandURLs = {
    "z3ntscap.tstechlab.com": "https://trial-7106116.okta.com/app/zendesk/exkofqneofWUyZKji697/sso/saml",
    "z3ntsiron.tstechlab.com": "https://login.microsoftonline.com/6f872148-df1d-4695-9714-225a526accdb/saml2",
    //"z3ntsthor.tstechlab.com": "https://0d0d-13-229-18-8.ngrok-free.app/tscaploginpage"
    "z3ntsthor.tstechlab.com": "https://z3ntsthor.tstechlab.com/access/normal"
};

const LoginRedirectPage = () => {
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

export default LoginRedirectPage;