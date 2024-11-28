import React, { ReactNode } from "react";

const AuthFormContainer: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <div className="mt-20 mb-5 w-[350px] mx-auto">
            <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="Logo" width="80" height="80" className="mb-10 mx-auto block" />
            {children}
        </div>
    );
}

export default AuthFormContainer;