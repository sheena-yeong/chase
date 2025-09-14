function Body({
  channel,
  message,
  setChannel,
  setMessage,
  handleSendMessage,
  status,
}) {
  return (
    <>
      <p>Channel: (uat: C09CQ4J6NLF)</p>
      <input
        type="text"
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
      />
      <p>Message: </p>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" onClick={handleSendMessage}>
        Send to Slack
      </button>
      <br />
      <p>Status: {status}</p>
      <button>Send Summary</button>
      <button>Chase All</button>
    </>
  );
}

export default Body;
