"use client";
import {useState} from "react";
import {LogOut} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

export default function LogoutButton(){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function logout(){
  if(busy)return;
  setBusy(true);setError("");
  try{
   const supabase=createClient();
   // Explicitly revoke the current browser session before leaving the protected app.
   const {error:signOutError}=await supabase.auth.signOut({scope:"local"});
   if(signOutError)throw signOutError;
   // A full navigation ensures the server and client both render the signed-out page.
   window.location.replace("/login?logged_out=1");
  }catch(e){
   console.error("Crescent RFI logout failed:",e);
   setError(e instanceof Error?e.message:"Logout failed. Please try again.");
   setBusy(false);
  }
 }
 return <div style={{display:"grid",justifyItems:"end",gap:4}}>
  <button type="button" className="secondary" onClick={logout} disabled={busy} style={{display:"inline-flex",alignItems:"center",gap:7,opacity:busy?.65:1}}>
   <LogOut size={15}/>{busy?"Logging out…":"Logout"}
  </button>
  {error&&<span role="alert" style={{fontSize:11,color:"#ff9b9b",maxWidth:260,textAlign:"right"}}>{error}</span>}
 </div>
}