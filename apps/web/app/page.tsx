'use client'
import Image from "next/image";
/* import { Button } from "@repo/ui/button"; */
import styles from "./page.module.css";

import { useQuery, QueryClient, QueryClientProvider, ReactQueryDevtools } from "@repo/query";
import { } from '@repo/ui/button';
import { button as Button } from '../components/button/button';

type Post = {
  body: string,
  id: number,
  title: string,
  userId: number
}

const fetchData = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const usePostsQuery = <T,>() => {
  return useQuery<T>({
    queryKey: ['posts'],
    queryFn: fetchData,
    staleTime: 20000,
  })
}

const SubComponent = () => {
  const { data } = usePostsQuery<Post>();

  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <p>{data?.title}</p>
  )
}

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <Button className={styles.secondary}>
            Open alert
          </Button>
          <SubComponent />
        </main>
        <footer className={styles.footer}>
          <a
            href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://turbo.build?utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to turbo.build →
          </a>
        </footer>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
