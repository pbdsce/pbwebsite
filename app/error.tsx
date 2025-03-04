'use client';

export default function Error(){
    return <div className="w-screen h-screen flex flex-col justify-center items-center font-mono">
        <div className="font-bold text-4xl text-red-200">500</div>
        <div className="text-2xl">Something went wrong!</div>
        <div className="">Unexpected Error Occured</div>
    </div>
}