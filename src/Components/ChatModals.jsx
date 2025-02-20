// /* eslint-disable react/no-unknown-property */
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { IoIosSend } from "react-icons/io";
// import { FaMicrophone } from "react-icons/fa";
// import axios from "axios";
// import Model from "./3dModal";
// import { useState } from "react";
// import { Loader } from "./utils/Loader";

// const Chat = () => {
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [isTalking, setIsTalking] = useState(false);
//     const [isRecording, setIsRecording] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const fetchResponse = async (userMessage) => {
//         try {
//             setIsLoading(true);
//             const res = await axios.post("http://localhost:8000/process_text", { message: userMessage });
//             return res.data.response;
//         } catch (error) {
//             console.error("API Error:", error);
//             return "Sorry, I couldn't fetch a response.";
//         }finally{
//             setIsLoading(false);
//         }
//     };

//     const handleSend = async (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const userMessage = { text: input, sender: "user" };
//         setMessages([...messages, userMessage]);
//         setInput("");

//         const aiResponse = await fetchResponse(input);
//         const botMessage = { text: aiResponse, sender: "bot" };
//         setMessages((prev) => [...prev, botMessage]);

//         const speech = new SpeechSynthesisUtterance(aiResponse);
//         speech.lang = "en-US";
//         speech.onstart = () => setIsTalking(true);
//         speech.onend = () => setIsTalking(false);
//         speechSynthesis.speak(speech);
//     };

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             alert("Speech recognition is not supported in this browser.");
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.lang = "en-US";
//         recognition.continuous = false;
//         recognition.interimResults = false;

//         recognition.onstart = () => setIsRecording(true);
//         recognition.onend = () => setIsRecording(false);

//         recognition.onresult = (event) => {
//             const transcript = event.results[0][0].transcript;
//             setInput(transcript);
//         };

//         recognition.start();
//     };
//     // const speak = (text) => {
//     //     const speech = new SpeechSynthesisUtterance(text);
//     //     const voices = window.speechSynthesis.getVoices();

//     //     // Select a different voice (Example: British Male or Female voice)
//     //     const selectedVoice = voices.find((voice) => voice.name.includes("Google UK English Male")) || voices[0];

//     //     if (selectedVoice) {
//     //         speech.voice = selectedVoice;
//     //     }

//     //     speech.lang = "en-GB"; // Change language if needed
//     //     speech.rate = 1; // Adjust speaking speed (0.5 = slow, 2 = fast)
//     //     speech.pitch = 1; // Adjust pitch (0 = low, 2 = high)

//     //     speechSynthesis.speak(speech);
//     // };

//     return (
//         <div className="h-[100vh] flex flex-col items-center bg-gray-900 text-white p-4 gap-1">
//             {/* 3D Model */}
//             <div className="w-full h-[30vh] bg-white rounded-md flex items-center justify-center">
//                 {/* <Canvas className="w-full h-full">
//                     <OrbitControls />
//                     <ambientLight intensity={1} />
//                     <pointLight position={[5, 5, 5]} />
//                     <Model isTalking={isTalking} />
//                 </Canvas> */}
//                 <img src="/images/dog.gif" alt="Talking Dog" className=" h-full object-cover" />
//             </div>

//             {/* Chat Messages */}
//             <div className="w-full h-[60vh] overflow-y-auto flex flex-col gap-2 p-2">
//                 {messages.length > 0 ? (
//                     messages.map((msg, index) => (
//                         <div key={index} className={`p-3 max-w-[75%] rounded-lg ${msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-800 self-start"}`}>
//                             {msg.text}
//                         </div>
//                     ))
//                 ) : (
//                     <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
//                         How can I help you?
//                     </div>
//                 )}
//             </div>

//             {/* Input & Voice Recording */}
//             <form onSubmit={handleSend} className="w-full flex items-center gap-2 mt-2 h-[10vh]">
//                 <input
//                     type="text"
//                     placeholder="Ask something..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     className="flex-1 p-3 bg-gray-800 rounded-md text-white focus:outline-none"
//                 />
//                 <button type="button" onClick={startListening} className={`p-3 rounded-md ${isRecording ? "bg-red-500" : "bg-green-500"}`}>
//                     <FaMicrophone size={24} />
//                 </button>
//                 <button type="submit" disabled={!input} className={`p-3 rounded-md ${input ? "bg-blue-500" : "bg-gray-600"}`}>
//                     {isLoading ? <Loader /> : <IoIosSend size={24} />}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Chat;

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { Loader } from "./utils/Loader";
// import Model from "./3dModal";

const Chat = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTalking, setIsTalking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [botResponse, setBotResponse] = useState("");
    const ws = useRef(null);
    const responseRef = useRef(""); // 🔹 Duplicate voice fix
    const messagesEndRef = useRef(null);
    useEffect(() => {
        ws.current = new WebSocket("ws://116.202.210.102:5007/api/ws");

        ws.current.onopen = () => console.log("WebSocket connection established");
        ws.current.onclose = () => console.log("WebSocket connection closed");
        ws.current.onerror = (error) => console.error("WebSocket error:", error);

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.delta) {
                setIsLoading(false);

                setMessages((prev) => {
                    if (
                        prev.length > 0 &&
                        prev[prev.length - 1].sender === "bot" &&
                        prev[prev.length - 1].text.includes(data.delta.trim())
                    ) {
                        return prev; // 🔹 Duplicate message ignore 
                    }

                    if (prev.length > 0 && prev[prev.length - 1].sender === "bot") {
                        const updatedMessages = [...prev];
                        updatedMessages[updatedMessages.length - 1].text += data.delta;
                        return updatedMessages;
                    } else {
                        return [...prev, { sender: "bot", text: data.delta }];
                    }
                });

                // 🔹 Response accumulate but duplicate avoid
                if (!responseRef.current.includes(data.delta.trim())) {
                    responseRef.current += data.delta;
                    setBotResponse((prev) => prev + data.delta);
                }
            }

            if (data.complete) {
                speak(responseRef.current.trim());
                responseRef.current = "";
            }
        };

        return () => ws.current.close();
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
        setIsLoading(true);

        ws.current.send(JSON.stringify({ message: input }));
        setBotResponse("");
        responseRef.current = "";
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);

        recognition.onresult = (event) => setInput(event.results[0][0].transcript);

        recognition.start();
    };

    const speak = (text) => {
        if (!text.trim()) return;

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onstart = () => setIsTalking(true);
        speech.onend = () => setIsTalking(false);

        window.speechSynthesis.speak(speech);
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-[100vh] flex flex-col items-center bg-gray-900 text-white p-4 gap-1">
            {/* 3D Model */}
            <div className="w-full h-[30vh] bg-white rounded-md flex items-center justify-center">
                {/* <Canvas className="w-full h-full">
//                     <OrbitControls />
//                     <ambientLight intensity={1} />
//                     <pointLight position={[5, 5, 5]} />
//                     <Model isTalking={isTalking} />
//                 </Canvas> */}
                <img src="/images/dog.gif" alt="Talking Dog" className="h-full object-cover" />
            </div>

            {/* Chat Messages */}
            <div className="w-full h-[62vh] overflow-y-auto flex flex-col gap-2 p-2">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`p-3 max-w-[75%] rounded-lg ${msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-800 self-start"}`}>
                            {msg.text}
                        </div>
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                        How can I help you?
                    </div>
                )}
                <div ref={messagesEndRef} />
                <div ref={messagesEndRef} />
            </div>

            {/* Input & Voice Recording */}
            <form onSubmit={handleSend} className="w-full flex items-center gap-2 mt-2 h-[8vh]">
                <input
                    type="text"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-3 bg-gray-800 rounded-md text-white focus:outline-none"
                />
                <button type="button" onClick={startListening} className={`p-3 rounded-md ${isRecording ? "bg-red-500" : "bg-green-500"}`}>
                    <FaMicrophone size={24} />
                </button>
                <button type="submit" disabled={!input} className={`p-3 rounded-md ${input ? "bg-blue-500" : "bg-gray-600"}`}>
                    {isLoading ? <Loader /> : <IoIosSend size={24} />}
                </button>
            </form>
        </div>
    );
};

export default Chat;