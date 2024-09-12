"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import qs from "query-string";
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
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."

    })
})

export const MessageFileModal = () => {
 
    const {isOpen,onCloseMain,type,data}=useModal();
    const isModalOpen =isOpen && type==='messageFile';
const {apiUrl,query}=data;
   const router=useRouter()
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url=qs.stringifyUrl({
                url:apiUrl||"",
                query
            })
            await axios.post(url,{
                ...values,
                content:"FileThere"
            })
        router.refresh();

            handleClose()
        } catch (error) {
            console.log("OnSubmitError",error);
            
        }

    }
    const handleClose=()=>{
        form.reset();
        onCloseMain();
    }
  
    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">

                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center text-2xl font-bold">
                            Add an attachment
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500" >
                            Send a file as a message
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-8 px-8 py-6">
                                <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="fileUrl"
                                 render={({ field }) => (
                                    <FormItem>

                                         <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                         File Upload
                                     </FormLabel>
                                     <FormControl>
                                        <FileUpload
                                            endpoint="messageFile"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                     </FormControl>
                                     <FormMessage/> 
                                     </FormItem>
                                     )}/>
                                    
                                </div>
                            </div>
                            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button  disabled={isLoading} variant={"primary"}>
                Send
              </Button>
            </DialogFooter>
                                </form>

                    </Form>


                </DialogContent>
            </Dialog>
        </>
    );
}
