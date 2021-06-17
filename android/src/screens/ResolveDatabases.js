import { useEffect } from 'react';
import { initAll } from "../database";

const ResolveAuthScreen = () => {

    useEffect(() => {
      initAll();
    }, []);

    return null;
};

export default ResolveAuthScreen;