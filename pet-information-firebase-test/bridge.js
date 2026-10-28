// PawApp Pet Information Firebase STAGING only.
// This module has no connection to PawApp Concierge / Supabase.
// Never pass the customer's civil ID to this bridge.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
const app=initializeApp({
 apiKey:"AIzaSyDn1sTtz52ro-0m3woM0JfFvVOVXoPj7tY",
 authDomain:"pawapp-pet-information.firebaseapp.com",
 projectId:"pawapp-pet-information",
 storageBucket:"pawapp-pet-information.firebasestorage.app",
 messagingSenderId:"288139146341",
 appId:"1:288139146341:web:38359016346c248783828c"
},"pawapp-pet-form-staging");
const auth=getAuth(app),db=getFirestore(app);
const text=(v,max=250)=>String(v==null?"":v).trim().slice(0,max);
const phone=v=>{let n=text(v).replace(/\D/g,"");if(n.startsWith("965")&&n.length===11)n=n.slice(3);return /^\d{8}$/.test(n)?n:""};
export async function createTestAppointment(p){
 if(!p||!text(p.clientName)||!phone(p.phone)||!/^\d{4}-\d{2}-\d{2}$/.test(text(p.preferredDate))||!/^\d{2}:\d{2}$/.test(text(p.preferredTime)))throw Error("Invalid name, phone, or appointment date/time");
 const user=(await signInAnonymously(auth)).user;
 const id="PET-TEST-"+crypto.randomUUID();
 const record={
   id,sourceRef:id,createdBy:user.uid,isTest:true,
   clientName:text(p.clientName,120),phone:phone(p.phone),dogName:text(p.dogName,100),
   petId:text(p.petId,20),services:(Array.isArray(p.services)?p.services:[]).slice(0,8).map(x=>text(x,90)),
   preferredDate:text(p.preferredDate,10),preferredTime:text(p.preferredTime,5),
   area:text(p.area,100),address:text(p.address,350),breed:text(p.breed,100),
   petAge:text(p.petAge,60),micro:text(p.micro,30),annual:text(p.annual,30),
   rabies:text(p.rabies,30),vaccineDate:text(p.vaccineDate,15),originalNotes:text(p.originalNotes,600),
   clinic:"",doctor:"",finalDate:"",finalTime:"",price:"",clinicShare:"",pawappShare:"",
   paymentLink:"",paymentStatus:"unpaid",status:"new",notes:"",reminderDismissed:false,
   createdAt:Date.now(),updatedAt:Date.now()
 };
 // Exclude civil ID, civil ID image, and all other unnecessary identifiers.
 await setDoc(doc(db,"pet_appointments",id),record);
 return id;
}
