// @ts-nocheck
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import axios from "axios";



export const InviteModal = () => {
   const {isOpen,type,onCloseMain,data,onOpen}=useModal()
    const isModalOpen = isOpen && type ==="invite"
    const [copied,setCopied]=useState(false);
    const [loading,setLoading]=useState(false);
    const { toast } = useToast()
    const origin =useOrigin();
    const {server}=data
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`
    const onCopy=()=>{
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true);
        toast({
            variant:"primary",
            description: "Text is copied to clipboard",
          })
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    }
    const onNew=async()=>{
        try {
            setLoading(true)
            const respose =await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onCloseMain("reload")
            onOpen("invite",{server:respose.data})
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }
    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onCloseMain} >
                <DialogContent className="bg-white text-black p-0 overflow-hidden">

                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center text-2xl font-bold">
                            Invite Friends
                        </DialogTitle>
                        
                    </DialogHeader>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Server Invite Link
                            
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input className="bg-zinc-300/50 border-0 focus:visible:ring-0 text-black focus-visible:ring-offset-0"  value={inviteUrl} disabled={loading} readOnly/>
                            <Button size="icon" onClick={onCopy} disabled={loading}>
                                {copied?<Check/>:
                                <Copy className="w-4 h-4"/>}
                                </Button>
                        </div>
                        <Button variant="link" size="sm" className="text-xs text-zinc-500 mt-4" disabled={loading} onClick={onNew}>
                            Generate a new link
                                <RefreshCw className="w-4 h-4 ml-2"/>
                            </Button>
                    </div>


                </DialogContent>
            </Dialog>
        </>
    );
}
