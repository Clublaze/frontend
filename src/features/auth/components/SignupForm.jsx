const SignupForm = () => {
  return (
    <form className="space-y-4">
      {/* Full Name */}
      <div>
        <input
          type="text"
          placeholder="Full name"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 py-3 font-medium text-white hover:opacity-90 transition shadow-[0_0_30px_#9333ea60]"
      >
        Create Account →
      </button>
    </form>
  );
};

export default SignupForm;
