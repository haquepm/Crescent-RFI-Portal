"use client";
import {usePathname,useRouter} from "next/navigation";
import {useEffect,useState} from "react";
import {Home,ClipboardList,ListChecks,LogOut} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

const items=[["Home","/",Home],["Register","/register",ClipboardList],["Checklist","/checklists",ListChecks]] as const;

export default function MobileNav(){
 const path=usePathname();
 const router=useRouter();
 const [loggingOut,setLoggingOut]=useState(false);
 async function logout(){
  if(loggingOut)return;
  setLoggingOut(true);
  const {error}=await createClient().auth.signOut();
  if(error){window.alert("Unable to log out. Please try again.");setLoggingOut(false);return}
  router.replace("/login");router.refresh();
 }
 return <nav className="mobile-nav" aria-label="Main navigation">
  {items.map(([name,url,Icon])=><button type="button" key={url} aria-current={path===url?"page":undefined} className={path===url||(url==="/register"&&path.startsWith("/rfis/"))?"selected":""} onClick={()=>router.push(url)}>
   <Icon size={25} strokeWidth={2.1}/><span>{name}</span>
  </button>)}
  <button type="button" onClick={logout} disabled={loggingOut}><LogOut size={25} strokeWidth={2.1}/><span>{loggingOut?"Logging out":"Logout"}</span></button>
 </nav>
}
