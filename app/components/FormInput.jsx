import React from "react";

export function Username({ value, onChange, name = "username", placeholder = "Username", required = true }) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Username</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export function Email({ value, onChange, name = "email", placeholder = "Email", required = true }) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Email</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>
      <input
        type="email"
        name={name}
        placeholder={placeholder}
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export function Password({ value, onChange, name = "password", placeholder = "Password", required = true, showToggle = false }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Password</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className="input input-bordered w-full pr-10"
          value={value}
          onChange={onChange}
          required={required}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function SubmitButton({ text = "Submit", isLoading = false, className = "" }) {
  return (
    <button
      type="submit"
      className={`btn btn-primary w-full ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
}
