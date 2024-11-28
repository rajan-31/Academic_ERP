import { Image } from "primereact/image";
import React, { Dispatch, SetStateAction } from 'react'

export const ProfileImage = (
    {imageSrc, setImageSrc}: 
    {imageSrc: string,setImageSrc: Dispatch<SetStateAction<string>>}
    ) => {
    return (
        <div className="mb-5 flex justify-center">
            <Image src={imageSrc} alt="Profile"
                height="200"
                preview={true}
                pt={{
                    root: { className: "flex justify-center rounded-full overflow-hidden shadow-xl shadow-blue-500/50 w-[200px] h-[200px]" },
                }}
                closeOnEscape={true}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    setImageSrc("/images/user_placeholder.png");
                }}
            />
        </div>
    )
}
