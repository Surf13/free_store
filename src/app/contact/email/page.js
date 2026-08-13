"use client";

import { sendEmail} from "@/app/api/sendEmail";
import {useState} from 'react';

export default function Page(){
    const [status, setStatus] = useState(null);

    async function handlerEmail(event){
        event.preventDefault()
        const data = new FormData(event.target);

        try{
            const result = await sendEmail(data);
            setStatus(result.status);
        } catch (error){
            setStatus("Failed to send Email");
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <main className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">

            {status ? (
                <p className="text-center text-green-600 font-semibold">{status}</p>
            ) : (
            <div>
            <h1 className="text-2xl font-bold text-center mb-6"> Tell us how we did!</h1>
            <p className="text-1x1 font-normal text-center mb-6"> If you had any trouble shopping with us, we love to hear about how we could make your experience better</p>
            <form className="space-y-4" onSubmit={handlerEmail}>
                <div>
                    <label htmlFor='email' className="block text-sm font-medium text-grey-700">Email</label>
                    <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className ="block w-full border border-grey-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-grey-700">Message</label>
                    <textarea
                    id="message"
                    required 
                    name="message"
                    rows="4"
                    className ="block w-full border border-grey-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>
                <button type="submit" className="block w-full text-white bg-blue-600 rounded-md p-3zs">
                    Send Message
                </button>
            </form>
            </div>
            )}
        </main>
        </div>
    );
}