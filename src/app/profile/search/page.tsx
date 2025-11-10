"use client";
import { UsersContainer, UserWrapper } from "@/components/templates/users-components";
import Search from "@/components/ui/default-serch";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/lib/actions/actions";
import { timeAgo } from "@/utils/timeAgo";
import React, { useEffect, useMemo, useState } from "react";

export default function SearchUserPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue);
  const [users, setUsers] = useState<
    | {
        id: string;
        image: string | null;
        username: string;
        name: string;
        createdAt: Date;
      }[]
  >([]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let result: {
      id: string;
      image: string | null;
      username: string;
      name: string;
      createdAt: Date;
    }[] = users;
    if (debouncedValue) {
      result = result.filter((u) =>
        u.username.toLowerCase().includes(debouncedValue.toLowerCase())
      );
    }
    return result;
  }, [debouncedValue, users]);

  useEffect(() => {
    searchUsers({
      username: debouncedValue,
      ids: users?.map((user) => user.id) ?? [""],
    }).then((res) => {
      if (res.success && res.users) {
        
        setUsers((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const unique = res.users.filter((u) => !existingIds.has(u.id));

          return [...prev, ...unique]
        });
      }
    });
  }, [debouncedValue]);

  return (
    <div className="p-5 flex flex-col gap-2.5">
      <div className="w-full flex flex-col gap-2 items-center relative">
        <h1 className="text-white">Search For Users</h1>

        <div className="flex gap-3 items-center relative">
          <Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {filteredUsers.length && <UsersContainer>
        {filteredUsers.map((u) => (
          <UserWrapper key={u.id} {...u} joined={timeAgo(u.createdAt)} />
        ))}
      </UsersContainer>}
    </div>
  );
}
