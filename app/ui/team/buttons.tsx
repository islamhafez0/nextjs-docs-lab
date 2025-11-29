"use client";

import { updateUserRole, removeTeamMember } from "@/app/lib/actions";
import { Role } from "@/app/lib/definitions";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function AddMember() {
  return (
    <Link
      href="/dashboard/team/add"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Member</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateRole({
  id,
  currentRoleId,
  roles,
}: {
  id: string;
  currentRoleId: string | null;
  roles: Role[];
}) {
  const handleRoleChange = async (formData: FormData) => {
    const newRoleId = formData.get("role_id") as string;
    if (newRoleId && newRoleId !== currentRoleId) {
      await updateUserRole(id, newRoleId);
    }
  };

  return (
    <form action={handleRoleChange}>
      <select
        name="role_id"
        defaultValue={currentRoleId || ""}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="rounded-md border border-gray-200 py-1 px-2 text-sm cursor-pointer"
      >
        <option value="" disabled>
          Select role
        </option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
    </form>
  );
}

export function ActionsDropdown({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this member?")) {
      await removeTeamMember(id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 hover:bg-gray-100"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href={`/dashboard/team/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
