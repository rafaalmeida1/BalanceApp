import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from "next/router";
import { api } from "../lib/api";

const LoginFormSchema = z.object({
  email: z.string(),
  password: z.string()
})

type LoginFormInput = z.infer<typeof LoginFormSchema>

export default function Login(){
  const route = useRouter();

  
  const { register, handleSubmit, reset } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema)
  })

  async function handleLoginSubmitForm(data: LoginFormInput) {
    try {
      const res = await api.post('/login', data);

      localStorage.setItem(
        "@balance-app-auth:1.0.0",
        JSON.stringify(res.data)
      )

      if(res.data.userLoggedIn.id !== null) {
        route.push(`/user/${res.data.userLoggedIn.id}`)
      } else {
        localStorage.removeItem("@balance-app-auth:1.0.0");
        route.push('/login') 
        reset();
      }

    }catch(err) {

    }
  }  

  return (
    <form onSubmit={handleSubmit(handleLoginSubmitForm)}>
      <input type="email" placeholder="email@gmail.com" {...register("email")}  required />
      <input type="password" placeholder="********" {...register("password")}  required />
      <button type="submit">Sign In</button>
    </form>
  )
}