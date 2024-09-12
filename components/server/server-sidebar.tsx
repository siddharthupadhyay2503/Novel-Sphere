import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components//ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSideProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-4 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-4 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-4 h-4 w-4" />,
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSideBar = async ({ serverId }: ServerSideProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    if (!server) {
      return redirect("/");
    }

    const textChannels = server.channels.filter((channel) => {
      return channel.type === ChannelType.TEXT;
    });
    const audioChannel = server.channels.filter((channel) => {
      return channel.type === ChannelType.AUDIO;
    });
    const videoChannel = server.channels.filter((channel) => {
      return channel.type === ChannelType.VIDEO;
    });
    const members = server?.members.filter(
      (member) => member.profileId !== profile.id
    );
    const role = server.members.find(
      (member) => member.profileId === profile.id
    )?.role;
    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                
                //   label: "Voice Channels",
                //   type: "channel",
                //   data: audioChannel?.map((channel) => ({
                //     id: channel.id,
                //     name: channel.name,
                //     icon: iconMap[channel.type],
                //   })),
                // },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannel?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: members?.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Text Channels"
                channelType={ChannelType.TEXT}
                role={role}
                sectionType="channels"
              />
              <div className="space-y-[2px]">
                {textChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )}
          {/* {!!audioChannel?.length && (
            <div className="mb-2">
              <ServerSection
                label="Voice Channels"
                channelType={ChannelType.AUDIO}
                role={role}
                sectionType="channels"
              />
              <div className="space-y-[2px]">
                {audioChannel.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )} */}
          {!!videoChannel?.length && (
            <div className="mb-2">
              <ServerSection
                label="Video Channels"
                channelType={ChannelType.VIDEO}
                role={role}
                sectionType="channels"
              />
              <div className="space-y-[2px]">
                {videoChannel.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>{" "}
            </div>
          )}
          {!server.membersHidden && !!members?.length && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="members"
              role={role}
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
        </ScrollArea>
      </div>
    );
  } catch (error) {
    console.error("Error fetching server:", error);
    // Handle the error gracefully, e.g., show an error message.
    return <div>Error fetching server data.</div>;
  }
};
