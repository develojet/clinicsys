import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        /* w-screen ensures we ignore any remaining parent padding */
        <div className="min-h-screen w-full bg-slate-100 flex flex-col">
            <Navbar />

            {/* This div centers the main column on the screen */}
            <div className="flex-1 flex flex-col items-center w-full">

                {/* max-w-7xl limits the width, mx-auto centers it */}
                <main className="w-full max-w-7xl px-4 py-8 md:px-8">

                    {/* The White Content Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[80vh] p-8 w-full">
                        {/* We removed 'items-center' here so your
                            dashboard content starts at the top-center
                            rather than the literal middle of the page */}
                        {children}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default MainLayout;