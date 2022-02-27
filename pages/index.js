import styles from '../styles/Home.module.css';
import { signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'loading') return null;
  return (
    <div className="h-screen flex justify-center items-center flex-col bg-he-beige">
      <Head>
        <title>Highlander Engineering Sign Out</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl font-bold text-he-purple my-10">
        Highlander Engineering Hardware Request
      </h1>
      {status === 'unauthenticated' && (
        <div className="">
          <button
            onClick={() => signIn(['google'])}
            className="border rounded px-4 py-2 flex gap-2 border-black hover:text-slate-100 hover:bg-he-purple hover:border-he-purple"
          >
            <img src="/google_logo.svg" />
            Sign in with Google
          </button>
        </div>
      )}
      {status === 'authenticated' && (
        <div>
          <button
            className="border bg-blue-500 text-white rounded px-4 py-2 text-lg"
            onClick={() => {
              router.push('/request');
            }}
          >
            Request
          </button>
          <button
            className="border ml-3 bg-red-500 text-white rounded px-4 py-2 text-lg"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
