"use client"

import { ServerWithMemberWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps{
    server:ServerWithMemberWithProfile;
    role?:MemberRole;
}
export const ServerHeader = ({server,role}:ServerHeaderProps) => {
    const isAdmin=role===MemberRole.ADMIN;
    const isModerator=isAdmin|| role=== MemberRole.MODERATOR;
    const {onOpen}=useModal();
    return ( <>
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 md:ml-auto   md:block"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {
                    isModerator &&(
                        <DropdownMenuItem
                            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:bold" onClick={()=>onOpen("invite",{server})}
                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin &&(
                        <DropdownMenuItem
                        onClick={()=>onOpen("editServer",{server})
                        }
                            className="px-3 py-2 text-sm cursor-pointer hover:bold"
                        >
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }{
                    isAdmin &&(
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer hover:bold"
                           onClick={()=>onOpen("members",{server})}
                            
                        >
                            Manage Members
                            <Users className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }{
                    isModerator &&(
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer hover:bold"
                            onClick={()=>onOpen("createChannel",{server})}

                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator &&(
                       <DropdownMenuSeparator/>
                    )
                }
                {
                    isAdmin ?(
                        <DropdownMenuItem
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bold"
                            onClick={()=>onOpen("deleteServer",{server})}
                        >
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    ):
                    <DropdownMenuItem
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bold"
                            onClick={()=>onOpen("leaveServer",{server})}
                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                }
            </DropdownMenuContent>
        </DropdownMenu>
    </> );
}
 