"use server"

import { signIn } from "@/auth"
import { sign } from "crypto";

export async function doSocialLogin(formData: FormData) {
 
  const action = formData.get("action");

  console.log("doSocialLogin action:", action);

  if (typeof action !== "string") {
    throw new Error("Invalid action type");
  }

  await signIn(action, {redirectTo: "/boards"})
}

export async function doLogout(){

}