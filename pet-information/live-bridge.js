// PawApp Pet Information | isolated LIVE appointment copy to Firebase.
// Customer form's existing Concierge/WhatsApp path is unchanged; no civil ID is copied here.
import {initializeApp} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {getAuth,signInAnonymously} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {getFirestore,doc,setDoc} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
const cfg={
 apiKey:"AIzaSyDn1sTtz52ro-0m3woM0JfFvVOVXoPj7tY",
 authDomain:"pawapp-pet-information.firebaseapp.com",
 projectId:"pawapp-pet-information",
 storageBucket:"pawapp-pet-information.firebasestorage.app",
 messagingSenderId:"288139146341",
 appId:"1:288139146341:web:38359016346c248783828c"
};
const app=initializeApp(cfg,"pawapp-pet-form-live");
const auth=getAuth(app),db=getFirestore(app);
const t=(v,n=250)=>String(v??"").trim().slice(0,n);
const phone=v=>{let n=t(v).replace(/\D/g,"");if(n.startsWith("965")&&n.length===11)n=n.slice(3);return /^\d{8}$/.test(n)?n:""};
export async function saveAppointmentToFirebase(p,sourceRequestId){
 if(!/^[a-f0-9-]{36}$/i.test(String(sourceRequestId||""))||!p||!t(p.clientName)||!phone(p.phone)||!/^\d{4}-\d{2}-\d{2}$/.test(t(p.preferredDate))||!/^\d{2}:\d{2}$/.test(t(p.preferredTime)))throw Error("invalid-appointment");
 const user=(await signInAnonymously(auth)).user;
 const id="PET-LIVE-"+sourceRequestId.toLowerCase();
 const docData={
  id,sourceRef:id,createdBy:user.uid,isTest:false,
  clientName:t(p.clientName,120),phone:phone(p.phone),dogName:t(p.dogName,100),
  petId:t(p.petId,20),services:(Array.isArray(p.services)?p.services:[]).slice(0,8).map(v=>t(v,90)),
  preferredDate:t(p.preferredDate,10),preferredTime:t(p.preferredTime,5),
  area:t(p.area,100),address:t(p.address,350),breed:t(p.breed,100),petAge:t(p.petAge,60),
  micro:t(p.micro,30),annual:t(p.annual,30),rabies:t(p.rabies,30),
  vaccineDate:t(p.vaccineDate,15),originalNotes:t(p.originalNotes,600),
  clinic:"",doctor:"",finalDate:"",finalTime:"",price:"",clinicShare:"",pawappShare:"",
  paymentLink:"",paymentStatus:"unpaid",status:"new",notes:"",reminderDismissed:false,
  createdAt:Date.now(),updatedAt:Date.now()
 };
 // The customer's civil ID and any photos are intentionally NEVER saved in Firebase.
 await setDoc(doc(db,"pet_appointments",id),docData);
 return id;
}
