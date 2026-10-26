"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {LogOut} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
export default function LogoutButton(){const router=useRouter();const [busy,setBusy]=useState(false);async function logout(){if(busy)return;setBusy(true);const {error}=await createClient().auth.signOut();if(error){window.alert("Unable to log out. Please try again.");setBusy(false);return}router.replace("/login");router.refresh()}return <button type="button" className="secondary" onClick={logout} disabled={busy} style={{display:"inline-flex",alignItems:"center",gap:7}}><LogOut size={15}/>{busy?"Logging out…":"Logout"}</button>}