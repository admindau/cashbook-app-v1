
'use client';
import { createContext,useContext,useState,useCallback } from 'react';
import Toast from './Toast';
type T={show:(m:string)=>void};const C=createContext<T>({show:()=>{}});export function useToast(){return useContext(C);}
export default function ToastProvider({children}:{children:React.ReactNode}){const [toasts,set]=useState<{id:string;message:string}[]>([]);
const show=useCallback((m:string)=>{const id=Math.random().toString(36).slice(2);set(t=>[...t,{id,message:m}]);setTimeout(()=>set(t=>t.filter(x=>x.id!==id)),2500);},[]);
return(<C.Provider value={{show}}>{children}<div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">{toasts.map(t=><Toast key={t.id} message={t.message}/>)}</div></C.Provider>);}