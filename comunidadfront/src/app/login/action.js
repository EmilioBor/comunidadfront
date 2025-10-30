'use server'

import { setSessionToken } from "../lib/api/session" 
import { loginAPI } from "@/app/lib/api/auth";

const ROOT_PATH = "/example"

export async function login(data){
   
   return await setSessionToken(data);
   // return await loginAPI(data);
}
