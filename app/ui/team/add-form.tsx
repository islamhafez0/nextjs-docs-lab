"use client";

import Link from "next/link";
import {
  AtSymbolIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { addTeamMember, TeamState } from "@/app/lib/actions";
import { useActionState } from "react";
import { Role } from "@/app/lib/definitions";

export default function AddMemberForm({ roles }: { roles: Role[] }) {
  const initialState: TeamState = {
    message: null,
    errors: {},
  };
  const [state, formAction] = useActionState(addTeamMember, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter member's name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter member's email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role_id" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative">
            <select
              id="role_id"
              name="role_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="role_id-error"
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="role_id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.role_id &&
              state.errors.role_id.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {state.message && (
        <div className="mt-2">
          <p className="text-sm text-red-500" role="alert" aria-live="polite">
            {state.message}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/team"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Member</Button>
      </div>
    </form>
  );
}
