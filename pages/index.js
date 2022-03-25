import "bootstrap/dist/css/bootstrap.css";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Pusher from "pusher-js";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let allMessages = [];

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("be35e76308aa8e3abc7a", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      allMessages.push(data);
      setMessages(allMessages);
    });
  }, [allMessages]);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("http://localhost:8000/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ username, message }),
    });

    setMessage("");
  }

  return (
    <div className="container">
      <Script
        src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"
        onLoad={() => {
          const beamsClient = new PusherPushNotifications.Client({
            instanceId: process.env.NEXT_PUBLIC_INSTANCE_ID,
          });

          beamsClient
            .start()
            .then(() => beamsClient.addDeviceInterest("hello"))
            .then(() => console.log("Successfully registered and subscribed!"))
            .catch(console.error);
        }}
      />

      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <input
            className="fs-5 fw-semibold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div
          className="list-group list-group-flush border-bottom scrollarea"
          style={{ minHeight: "500px" }}
        >
          {messages.map((message) => {
            return (
              <>
                <div className="list-group-item list-group-item-action active py-3 lh-tight">
                  <div className="d-flex w-100 align-items-center justify-content-between">
                    <strong className="mb-1">{message.username}</strong>
                  </div>
                  <div className="col-10 mb-1 small">{message.message}</div>
                </div>
              </>
            );
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
