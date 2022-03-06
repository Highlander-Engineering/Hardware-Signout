import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import absoluteUrl from 'next-absolute-url';
import { validateEmail } from '../components/utils';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Image from 'next/image';

export default function RequestPage({ status, data, name, email }) {
  const router = useRouter();

  // const { status, data: session } = useSession();
  const [school, setSchool] = useState('');
  const [profession, setProfession] = useState('');
  const [amounts, setAmounts] = useState(
    data.reduce((obj, item) => Object.assign(obj, { [item.component]: 0 }), {})
  );

  const addOnClick = async () => {
    const filteredAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([key, value]) => value > 0)
    );
    if (!name || !school || !email || !profession) {
      console.log('Name', name);
      console.log('School', school);
      console.log('Email', email);
      console.log('profession', profession);

      return alert('Missing required fields');
    }
    if (!validateEmail(email)) {
      return alert('Invalid email address');
    }

    axios
      .post('/api/append', {
        data: {
          name,
          school,
          email,
          amounts: filteredAmounts,
          profession,
        },
      })
      .then(function (res) {
        if (res.data.status === 'error') {
          return alert(res.data.message);
        } else {
          alert(
            'Request sent, please check your inbox for a confirmation email!'
          );
          router.reload(window.location.pathname);
        }
      })
      .catch(function (error) {
        alert('Error, try again later');
        console.log(error);
      });
  };
  // if (status === 'loading') return null;
  if (status === 'unauthenticated')
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl mb-5">Please Sign In First</h1>
          <button
            className="bg-blue-300 text-white rounded px-4 py-2"
            onClick={() => router.push('/')}
          >
            Go Home
          </button>
        </div>
      </>
    );
  if (status === 'authenticated')
    return (
      <div className=" bg-he-beige">
        <Head>
          <title>Request Component</title>
        </Head>
        <button
          onClick={() => {
            router.push('/');
          }}
          className="text-xl ml-2 mt-6 px-2 rounded text-he-purple hover:bg-he-purple hover:text-white"
        >
          {' '}
          {'← '}Home
        </button>
        <div className="flex items-center justify-center gap-5 mb-9">
          <Image
            src="/assets/transparent_logo.png"
            alt="Logo"
            width="70"
            height="70"
          />
          <h1 className="text-3xl font-bold text-center text-he-purple">
            Request Hardware Component
          </h1>
        </div>
        <div className="flex flex-col gap-3 mx-4">
          <input
            placeholder="Name"
            value={name}
            // onChange={(e) => setName(e.target.value)}
            readOnly={name ? true : false}
            className="pl-3 py-1 border rounded-lg cursor-default select-none"
          />
          <input
            placeholder="Email"
            // onChange={(e) => setEmail(e.target.value)}
            value={email}
            readOnly={email ? true : false}
            required={true}
            className="pl-3 py-1 border rounded-lg cursor-default select-none"
          />
          <input
            placeholder="School"
            onChange={(e) => setSchool(e.target.value)}
            required={true}
            className="pl-3 py-1 border rounded-lg"
          />
          <span>You are...</span>
          <div className="flex items-center">
            <input
              type="radio"
              value="Student"
              name="profession"
              id="profession-student"
              onChange={(e) => setProfession('Student')}
            />{' '}
            <label htmlFor="profession-student" className="mr-4 ml-1">
              Student
            </label>
            <input
              type="radio"
              value="Teacher"
              name="profession"
              id="profession-teacher"
              onChange={(e) => setProfession('Teacher')}
            />{' '}
            <label htmlFor="profession-teacher" className="ml-1">
              {' '}
              Teacher
            </label>
          </div>
          <h1 className="text-2xl mt-5">Available Components</h1>
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 ">
            {data.map((item, i) => {
              return (
                <>
                  <div className="flex gap-5 items-center" key={i}>
                    <h1>
                      <span className="font-bold">{item.component}</span> (
                      {item.available} Left)
                    </h1>
                    <input
                      placeholder="Amount"
                      type={'number'}
                      onChange={(e) => {
                        setAmounts({
                          ...amounts,
                          [item.component]: +e.target.value,
                        });
                      }}
                      className="px-2 rounded-md outline-none py-1"
                    />
                    <div>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.component}
                          height="100"
                          width="100"
                          className="rounded-md hover:scale-95"
                        />
                      ) : (
                        <div>Image unable to load</div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <button
            onClick={addOnClick}
            className="border border-gray-700 rounded py-2 text-xl text-he-purple hover:bg-he-purple hover:text-white transition-all duration-200 mb-5"
          >
            {' '}
            Request
          </button>
        </div>
      </div>
    );
}
export async function getServerSideProps(context) {
  const { origin } = absoluteUrl(context.req);
  const { user } = await getSession({ req: context.req });
  if (!user) {
    return {
      props: {
        status: 'unauthenticated',
      },
    };
  }
  const data = await axios
    .get(`${origin}/api/getAvailableComponent`)
    .then((res) => {
      return res.data.data;
    });
  return {
    props: {
      status: 'authenticated',
      data,
      name: user.name,
      email: user.email,
    }, // will be passed to the page component as props
  };
}
