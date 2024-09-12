// @ts-nocheck
"use client"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"



export const LeaveServerModal = () => {
   const {isOpen,type,onCloseMain,data}=useModal()
    const isModalOpen = isOpen && type ==="leaveServer"
    const [isLoading,setIsLoading]=useState(false);
    const {server}=data;
    const router=useRouter();
    const leaveServer=async()=>{
      
      try {
        setIsLoading(true);        
       await axios.patch(`/api/servers/${server?.id}/leave`);       
        onCloseMain();
        router.push('/');
        router.refresh();
      } catch (error) {
        console.log("Server Leaving Error ",error);
        
      }finally{
        setIsLoading(false)
      }
    }
  
    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onCloseMain} >
                <DialogContent className="bg-white text-black p-0 overflow-hidden">

                    <DialogHeader className="pt-8 px-6 pb-6">
                        <DialogTitle className="text-center text-2xl font-bold ">
                            Leave Server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                          Are you sure you want to Leave <span className="text-indigo-500 font-semibold">{server?.name}</span> Server ?
                        </DialogDescription>
                    </DialogHeader>
                   
  <DialogFooter className="bg-gray-200 px-6 py-4 flex w-full">
              <Button  disabled={isLoading} variant={"ghost"} onClick={onCloseMain}>
                Cancel
              </Button>
              <Button  disabled={isLoading} variant={"primary"} onClick={leaveServer}>
                Confirm
              </Button>
            </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
