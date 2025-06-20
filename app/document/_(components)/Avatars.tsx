"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const AVATAR_SIZE = 36;

interface AvatarProps {
  src: string;
  name: string;
}

function Avatar({ src, name }: AvatarProps) {
  return (
    <>
      <div
        className={
          "group -ml-2 flex place-content-center shrink-0 relative border-4 border-white rounded-full bg-gray-500"
        }
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      >
        <div
          className={
            "opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 whitespace-nowrap bg-black transition-opacity"
          }
        >
          {name}
        </div>
        <Image
          height={36}
          width={36}
          src={src}
          alt={name}
          className={"z-full rounded-full"}
        />
      </div>
    </>
  );
}

function AvatarStack() {
  const users = useOthers();
  const currentUser = useSelf();

  if (users.length === 0) return null;

  return (
    <>
      <div className={"flex items-center"}>
        {currentUser && (
          <div className={"relative ml-2"}>
            <Avatar src={currentUser.info.avatar} name="You" />
          </div>
        )}
        <div className={"flex"}>
          {users.map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} src={info.avatar} name={info.name} />
            );
          })}
        </div>
      </div>
      <Separator orientation="vertical" className={"h-6"} />
    </>
  );
}

export default function Avatars() {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
}
