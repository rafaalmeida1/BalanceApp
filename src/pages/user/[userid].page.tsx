import { prisma } from "@/src/lib/prisma";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface UserStaticProps {
  user: {
    id: string;
    email: string 
    username: string;
    user_account: {
      balance: number;
    }
  }
}

export default function User({user}: UserStaticProps) {

  const route = useRouter()

  useEffect(() => {
    const userLoggedIn = JSON.parse(localStorage.getItem('@balance-app-auth:1.0.0')!)!;

    if(!userLoggedIn?.userLoggedIn?.id || userLoggedIn?.userLoggedIn?.id !== user?.id) {
      route.push('/login')
      localStorage.removeItem('@balance-app-auth:1.0.0')!
    }

  }, [route, user?.id])


  return (
    <>
      <h1>{user?.username}</h1>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{params: {userid: '1'}}],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<any, {userid: string}> = async ({ params }) => {
  if(!params) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const userId = params!.userid; 


  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      id: true,
      email: true,
      username: true,
      user_account: {
        select: {
          balance: true,
        },
      },
    },
  })

  return {
    props: {
      user
    },
    revalidate: 10
  }
}