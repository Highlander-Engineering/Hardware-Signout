import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import absoluteUrl from 'next-absolute-url';
import { validateEmail } from '../components/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function RequestPage({ data }) {
  const router = useRouter();

  const { status, data: session } = useSession();
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [amounts, setAmounts] = useState(
    data.reduce((obj, item) => Object.assign(obj, { [item.component]: 0 }), {})
  );

  const addOnClick = () => {
    const filteredAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([key, value]) => value > 0)
    );
    if (!name || !school || !email || !profession) {
      return alert('Missing required fields');
    }
    if (!validateEmail(email)) {
      return alert('Invalid email address');
    }
    Array.of(...Object.keys(filteredAmounts)).forEach((key) => {
      const stockItem = data.find((item) => item.component === key);
      if (amounts[key] > stockItem.available) {
        return alert("You can't request more than available stock");
      }
    });
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
        alert(
          'Request sent, please check your inbox for a confirmation email!'
        );
        router.reload(window.location.pathname);
      })
      .catch(function (error) {
        alert('Error, try again later');
        console.log(error);
      });
  };
  if (status === 'loading') return null;
  if (status === 'unauthenticated')
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl mb-5">Please Sign In First</h1>
          <button className="bg-blue-300 text-white rounded px-4 py-2">
            Go Home
          </button>
        </div>
      </>
    );
  console.log(session);
  if (status === 'authenticated')
    return (
      <div className="h-screen overflow-hidden bg-he-beige">
        <Head>
          <title>Request Component</title>
        </Head>
        <button
          onClick={() => {
            router.push('/');
          }}
          className="text-xl ml-2 mt-2 px-2 rounded text-he-purple hover:bg-he-purple hover:text-white"
        >
          {' '}
          {'← '}Home
        </button>
        <h1 className="text-3xl font-bold text-center my-10 text-he-purple">
          Request Hardware Component
        </h1>
        <div className="flex flex-col gap-3 mx-4">
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required={true}
            className="pl-3 py-1 border rounded-lg"
          />
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={session.user.email}
            readOnly={true}
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
            <label htmlFor="profession-student" className="mr-4">
              Student
            </label>
            <input
              type="radio"
              value="Teacher"
              name="profession"
              id="profession-teacher"
              onChange={(e) => setProfession('Teacher')}
            />{' '}
            <label htmlFor="profession-teacher"> Teacher</label>
          </div>
          <h1 className="text-2xl mt-5">Available Components</h1>
          {data.map((item, i) => {
            return (
              <>
                <div className="flex gap-5" key={i}>
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
                </div>
              </>
            );
          })}
          <button
            onClick={addOnClick}
            className="border rounded py-2 text-xl text-he-purple hover:bg-he-purple hover:text-white"
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
  const data = await axios
    .get(`${origin}/api/getAvailableComponent`)
    .then((res) => {
      return res.data.data;
    });
  return {
    props: { data }, // will be passed to the page component as props
  };
}
