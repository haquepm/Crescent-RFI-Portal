"use client";
import {usePathname,useRouter} from "next/navigation";
import {LayoutDashboard,ClipboardList,FilePlus2,CalendarCheck,ChartNoAxesCombined,ShieldCheck,LogOut} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
const items=[["Home","/",LayoutDashboard],["Register","/register",ClipboardList],["New RFI","/create",FilePlus2],["Inspections","/inspections",CalendarCheck],["Reports","/reports",ChartNoAxesCombined],["Admin","/access",ShieldCheck]] as const;
export default function MobileNav(){const path=usePathname();const router=useRouter();async function logout(){const {error}=await createClient().auth.signOut();if(error){window.alert("Unable to log out. Please try again.");return}router.replace("/login");router.refresh()}return <nav className="mobile-nav">{items.map(([name,url,Icon])=><button key={url} className={path===url||(url==="/register"&&path.startsWith("/rfis/"))?"selected":""} onClick={()=>router.push(url)}><Icon size={19}/><span>{name}</span></button>)}<button onClick={logout}><LogOut size={19}/><span>Logout</span></button></nav>}
