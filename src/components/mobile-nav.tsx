"use client";
import {useEffect,useState} from "react";
import {usePathname,useRouter} from "next/navigation";
import {LayoutDashboard,ClipboardList,FilePlus2,CalendarCheck,ChartNoAxesCombined,ShieldCheck,LogOut} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
const items=[["Home","/",LayoutDashboard],["Register","/register",ClipboardList],["New RFI","/create",FilePlus2],["Inspections","/inspections",CalendarCheck],["Reports","/reports",ChartNoAxesCombined],["Admin","/access",ShieldCheck]] as const;
export default function MobileNav(){
 const path=usePathname();const router=useRouter();const [isAdmin,setIsAdmin]=useState(false);
 useEffect(()=>{let active=true;async function loadRole(){const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user)return;const {data}=await sb.from("rfi_user_profiles").select("role,is_active").eq("user_id",user.id).maybeSingle();if(active)setIsAdmin(data?.is_active===true&&data?.role==="admin")}loadRole();return()=>{active=false}},[]);
 async function logout(){const {error}=await createClient().auth.signOut();if(error){window.alert("Unable to log out. Please try again.");return}router.replace("/login");router.refresh()}
 const visibleItems=items.filter(([name])=>name!=="Admin"||isAdmin);
 return <nav className="mobile-nav" data-item-count={visibleItems.length+1}>{visibleItems.map(([name,url,Icon])=><button key={url} className={path===url||(url==="/register"&&path.startsWith("/rfis/"))?"selected":""} onClick={()=>router.push(url)}><Icon size={19}/><span>{name}</span></button>)}<button onClick={logout}><LogOut size={19}/><span>Logout</span></button></nav>
}
