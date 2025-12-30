const LoginForm = () => {
  return (
    <form className="space-y-4">
      <input
        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
        placeholder="Email address"
      />
      <input
        type="password"
        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
        placeholder="Password"
      />

      <div className="text-right text-sm text-purple-400 cursor-pointer">
        Forgot password?
      </div>

      <button className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 py-3 font-medium hover:opacity-90">
        Sign In →
      </button>
    </form>
  );
};

export default LoginForm;
