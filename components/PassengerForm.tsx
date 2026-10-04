"use client";

import type { Passenger } from "@/lib/database.types";

export default function PassengerForm({
  value,
  onChange,
  boardingPoints,
  droppingPoints,
}: {
  value: Passenger;
  onChange: (next: Passenger) => void;
  boardingPoints: string[];
  droppingPoints: string[];
}) {
  function set<K extends keyof Passenger>(key: K, v: Passenger[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            required
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            className="input"
            placeholder="As on NID / passport"
          />
        </Field>
        <Field label="Mobile number" required>
          <input
            required
            type="tel"
            value={value.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            className="input"
            placeholder="01XXXXXXXXX"
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          value={value.email ?? ""}
          onChange={(e) => set("email", e.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Gender" required>
          <select
            value={value.gender}
            onChange={(e) => set("gender", e.target.value as Passenger["gender"])}
            className="input"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </Field>
        <Field label="Age">
          <input
            type="number"
            min={1}
            value={value.age ?? ""}
            onChange={(e) => set("age", Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Address">
        <input
          value={value.address ?? ""}
          onChange={(e) => set("address", e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Boarding point" required>
          <select
            value={value.boarding_point}
            onChange={(e) => set("boarding_point", e.target.value)}
            className="input"
          >
            <option value="">Select a boarding point</option>
            {boardingPoints.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Dropping point" required>
          <select
            value={value.dropping_point}
            onChange={(e) => set("dropping_point", e.target.value)}
            className="input"
          >
            <option value="">Select a dropping point</option>
            {droppingPoints.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
        {required && <span className="text-coral-500"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
