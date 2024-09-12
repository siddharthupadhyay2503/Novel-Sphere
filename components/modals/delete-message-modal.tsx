// @ts-nocheck
"use client"
import axios from "axios"
import qs from 'query-string'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"



export const DeleteMessageModal = () => {
   const {isOpen,type,onCloseMain,data}=useModal()
    const isModalOpen = isOpen && type ==="deleteMessage"
    const [isLoading,setIsLoading]=useState(false);
    const {apiUrl,query}=data;
     const deleteChannel=async()=>{
      
      try {
        setIsLoading(true);          
        const url=qs.stringifyUrl({
          url:apiUrl ||"",
          query
        })      
       await axios.delete(url);       
        onCloseMain();
      } catch (error) {
        console.log("Message Deleting Error ",error);
        
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
                            Delete Message
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                          Are you sure you want to do this ?<br/> This message
                          will be permanently deleted
                        </DialogDescription>
                    </DialogHeader>
                   
  <DialogFooter className="bg-gray-200 px-6 py-4 flex w-full">
              <Button  disabled={isLoading} variant={"ghost"} onClick={onCloseMain}>
                Cancel
              </Button>
              <Button  disabled={isLoading} variant={"primary"} onClick={deleteChannel}>
                Confirm
              </Button>
            </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
