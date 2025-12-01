import React, { useState } from "react";

const departments = ["Engineering", "Medicine", "Psychology", "Law", "Commerce"];
const roles = ["Student", "Counsellor"];
const interests = [
  "Anxiety", "Motivation", "Meditation", "Self-care", "Peer Support", "Stress", "Depression"
];

const Onboarding: React.FC<{ onComplete: (user: any) => void }> = ({ onComplete }) => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    department: "",
    role: "",
    interests: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <form
      className="max-w-md mx-auto bg-white/80 rounded-xl p-8 shadow-lg flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onComplete(form);
      }}
      aria-label="Onboarding Form"
    >
      <h2 className="text-2xl font-bold text-[#345E2C] mb-2">Welcome to Zeo.ai Community</h2>
      <input
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        className="rounded-lg border p-2"
        required
      />
      <input
        name="username"
        placeholder="Username (e.g. @yourname)"
        value={form.username}
        onChange={handleChange}
        className="rounded-lg border p-2"
        required
      />
      <select
        name="department"
        value={form.department}
        onChange={handleChange}
        className="rounded-lg border p-2"
        required
      >
        <option value="">Select Department</option>
        {departments.map(dep => <option key={dep}>{dep}</option>)}
      </select>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="rounded-lg border p-2"
        required
      >
        <option value="">Select Role</option>
        {roles.map(role => <option key={role}>{role}</option>)}
      </select>
      <div>
        <div className="mb-1 font-semibold text-[#345E2C]">Interests</div>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <button
              type="button"
              key={interest}
              className={`px-3 py-1 rounded-full border ${
                form.interests.includes(interest)
                  ? "bg-[#85B8CB] text-white"
                  : "bg-[#D2E4D3] text-[#345E2C]"
              }`}
              onClick={() => handleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-[#345E2C] text-white px-4 py-2 rounded-full font-semibold mt-4"
      >
        Continue
      </button>
    </form>
  );
};

export default Onboarding;