// @ts-nocheck
"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { FileUpload } from "@/components/file-upload"
import { useEffect, useState } from "react"
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

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."

    })
})

const InitialModel = () => {
    const [isMounted,setIsMounted]=useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
   const router=useRouter()
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers",values)
            form.reset();
            router.refresh();
            window.location.reload()
        } catch (error) {
            console.log("OnSubmitError",error);
            
        }

    }
    if(!isMounted){
        return null;
    }
    return (
        <>
            <Dialog open>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">

                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center text-2xl font-bold">
                            Create Your Server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500" >
                            Give your server a personality with a image and name. You can also change that later.
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
                                     <FormLabel className="text-xs text-zinc-500 dark:text-secondary/70">
                                         By creating a server you aggre to my <span className="text-blue-500">
                                            community guildlines
                                            </span>
                                     </FormLabel>
                                     </FormItem>
                                     )}/>
                            </div>
                            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button  disabled={isLoading} variant={"primary"}>
                Create
              </Button>
            </DialogFooter>
                                </form>

                    </Form>


                </DialogContent>
            </Dialog>
        </>
    );
}

export default InitialModel;