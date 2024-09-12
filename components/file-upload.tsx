"use client"
import {FileIcon, X} from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image"
import { Button } from "@/components/ui/button"
interface FileUploadProps{
    onChange:(url?:string)=>void,
    value:string,
    endpoint:"messageFile"|"serverImage"

}
export const FileUpload=({
    onChange,
    value,
    endpoint
}:FileUploadProps )=>{
    const filetype=value?.split(".").pop();

    if(value && filetype!="pdf"){
        return(
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="upload" sizes="sm" className="rounded-full"/>
                <Button onClick={()=>onChange("")} className=" bg-rose-500 text-white p-1 absolute top-0 right-0 shadow-sw rounded-full hover:bg-rose-400 h-6 w-6" type="button">
                <X className="w-4 h-4"/>
                </Button>
            </div>
        )
    }
    if(value && filetype=="pdf"){
        return(
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">{value}
                </a>
                <Button onClick={()=>onChange("")} className=" bg-rose-500 text-white p-1 absolute -top-2 -right-2 shadow-sw rounded-full hover:bg-rose-400 h-6 w-6" type="button">
                    <X className="w-4 h-4"/>
                </Button>
            </div>
        )
    }
    return(
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url)
        }}
        onUploadError={(error:Error)=>{
            console.log("OnUploadError",error);
            
        }}
        className="border-0"
        />
    )
}