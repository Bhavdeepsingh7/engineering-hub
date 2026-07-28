import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "../services/api";

export default function AuthBridge() {
    const { getToken } = useAuth();

    useEffect(() => {
        setAuthTokenGetter(getToken);
    }, [getToken]);

    return null;
}