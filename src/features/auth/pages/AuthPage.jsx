import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0614] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#6d28d980,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#9333ea40,transparent_60%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT */}
        <div className="w-1/2 px-24 py-20 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              🎓
            </div>
            <div>
              <h3 className="font-semibold">UniHub</h3>
              <p className="text-sm text-white/60">University Platform</p>
            </div>
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            The future of <br />
            <span className="text-purple-400">academic excellence</span>
          </h1>

          <p className="mt-6 max-w-xl text-white/70 text-lg">
            Experience the next generation university platform. Seamlessly
            manage courses, collaborate in real-time, and unlock your potential
            with AI-powered insights.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 max-w-lg">
            <Feature icon="🔐" title="Enterprise Security" subtitle="Bank-grade encryption" />
            <Feature icon="⚡" title="Lightning Fast" subtitle="Sub-100ms response" />
            <Feature icon="👥" title="500K+ Students" subtitle="Global community" />
            <Feature icon="✨" title="AI Powered" subtitle="Smart learning paths" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[420px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_0_80px_#9333ea30]">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-white/60 mb-6">Access your university portal</p>

            <div className="flex bg-black/30 rounded-full p-1 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-full text-sm ${
                  mode === "login"
                    ? "bg-purple-600"
                    : "text-white/60"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-full text-sm ${
                  mode === "signup"
                    ? "bg-purple-600"
                    : "text-white/60"
                }`}
              >
                Sign Up
              </button>
            </div>

            {mode === "login" ? <LoginForm /> : <SignupForm />}

            <div className="my-6 text-center text-white/40 text-sm">OR</div>

            <div className="flex gap-3">
              <button className="flex-1 bg-black/40 hover:bg-black/60 transition rounded-lg py-2">
                G Google
              </button>
              <button className="flex-1 bg-black/40 hover:bg-black/60 transition rounded-lg py-2">
                🐙 GitHub
              </button>
            </div>

            <p className="mt-6 text-xs text-white/40 text-center">
              By continuing, you agree to UniHub’s{" "}
              <span className="underline">Terms</span> &{" "}
              <span className="underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, subtitle }) => (
  <div className="flex gap-4 items-start bg-white/5 rounded-xl p-4 border border-white/10">
    <div className="text-xl">{icon}</div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-white/50">{subtitle}</p>
    </div>
  </div>
);

export default AuthPage;
