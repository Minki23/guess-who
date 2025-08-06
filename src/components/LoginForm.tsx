"use client"

import { doSocialLogin } from "@/app/actions"

const LoginForm = () => {
  return (
    <form action={(data)=>{doSocialLogin(data)}}>
      <button type="submit" name="action" value="google" className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In with Google
      </button>
    </form>
  )
}

export { LoginForm }