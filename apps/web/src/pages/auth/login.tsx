import { LoginForm } from "./login-form"

export function LoginPage() {
    return (
        <div className="min-h-svh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600/5 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo Section */}
               

                {/* Login Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <LoginForm />
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-white/50 text-sm">© 2025 AM.dev. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    )
}
