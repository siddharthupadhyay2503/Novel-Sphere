const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen flex justify-center items-center bg-blue-50">
            {children}
        </div>
    );
}

export default AuthLayout;