// @ts-nocheck
"use client"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"



export const DeleteServerModal = () => {
   const {isOpen,type,onCloseMain,data}=useModal()
    const isModalOpen = isOpen && type ==="deleteServer"
    const [isLoading,setIsLoading]=useState(false);
    const {server}=data;
    const router=useRouter();
    const deleteServer=async()=>{
      
      try {
        setIsLoading(true);        
       await axios.delete(`/api/servers/${server?.id}`);       
        onCloseMain();
        router.push('/');
        router.refresh();
      } catch (error) {
        console.log("Server Deleting Error ",error);
        
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
                            Delete Server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                          Are you sure you want to do this ?<br/><span className="text-indigo-500 font-semibold">{server?.name}</span> Server
                          will be permanently deleted
                        </DialogDescription>
                    </DialogHeader>
                   
  <DialogFooter className="bg-gray-200 px-6 py-4 flex w-full">
              <Button  disabled={isLoading} variant={"ghost"} onClick={onCloseMain}>
                Cancel
              </Button>
              <Button  disabled={isLoading} variant={"primary"} onClick={deleteServer}>
                Confirm
              </Button>
            </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
