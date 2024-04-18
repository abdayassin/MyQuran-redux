export default function Container({ children, withPadding = true, fullHeight = false }) {
    return (
        <div className={`w-full sm:max-w-7xl mx-auto px-2${withPadding ? ' sm:px-1 py-12' : ''}${fullHeight ? ' min-h-screen' : ''}`} >
            {children}
        </div >
    );
}