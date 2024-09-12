// @ts-nocheck
"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { FileUpload } from "@/components/file-upload"
import axios from "axios"
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."

    })
})

export const EditServerModal = () => {
   const {isOpen,type,onCloseMain,data}=useModal()
    const isModalOpen = isOpen && type ==="editServer"
   const router=useRouter()
   const {server}=data;
   
   
   const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    })
    useEffect(() => {
      if(server){
        form.setValue("name",server.name);
        form.setValue("imageUrl",server.imageUrl);
      }
    }, [server,form])
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}/edit`,values)
            form.reset();
            router.refresh();
            onCloseMain();
        } catch (error) {
            console.log("OnSubmitError",error);
            
        }

    }


    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onCloseMain} >
                <DialogContent className="bg-white text-black p-0 overflow-hidden">

                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center text-2xl font-bold">
                           Edit Your Server 
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500" >
                           By editing you can change the image and name of your server
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-8 px-8 py-6">
                                <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="imageUrl"
                                 render={({ field }) => (
                                    <FormItem>

                                         <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                         File Upload
                                     </FormLabel>
                                     <FormControl>
                                        <FileUpload
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                     </FormControl>
                                     <FormMessage/> 
                                     </FormItem>
                                     )}/>
                                    
                                </div>
                            <FormField control={form.control} name="name"
                                 render={({ field }) => (
                                    <FormItem>

                                         <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                         Server Name
                                     </FormLabel>
                                     <FormControl>
                                         <Input
                                             {...field}
                                             disabled={isLoading}
                                             className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                             placeholder="Enter Server Name"
                                         />
                                     </FormControl>
                                     <FormMessage/> 
                                     {/* <FormLabel className="text-xs text-zinc-500 dark:text-secondary/70">
                                         By creating a server you aggre to my <span className="text-blue-500">
                                            community guildlines
                                            </span>
                                     </FormLabel> */}
                                     </FormItem>
                                     )}/>
                            </div>
                            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button  disabled={isLoading} variant={"primary"}>
                Update
              </Button>
            </DialogFooter>
                                </form>

                    </Form>


                </DialogContent>
            </Dialog>
        </>
    );
}
