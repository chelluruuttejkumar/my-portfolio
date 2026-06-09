"use client";

// =================================================// ======================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";

import {
  Moon,
  Sun,
  X,
  Mic,
  Send,
  Minus,
} from "lucide-react";

// ======================================================
// ✅ GLASS COMPONENT
// ======================================================

function Glass({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        y: -2,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
      className={`
        ${className}
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/15
        bg-white/[0.08]
        backdrop-blur-[25px]
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />

      <div className="absolute inset-[1px] rounded-[31px] border border-white/10 pointer-events-none" />

      {children}
    </motion.div>
  );
}

// ======================================================
// ✅ TYPES
// ======================================================

type Project = {
  title: string;
  desc: string;
  image: string;
};

// ======================================================
// ✅ MAIN COMPONENT
// ======================================================

export default function Portfolio() {

  // ======================================================
  // ✅ STATES
  // ======================================================

  const [darkMode, setDarkMode] =
    useState(true);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [text, setText] =
    useState("");

  const [index, setIndex] =
    useState(0);

  const [cursor, setCursor] =
    useState({
      x: 0,
      y: 0,
    });

  // ✅ AI STATES

  const [aiOpen, setAiOpen] =
    useState(false);

  const [minimized, setMinimized] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [listening, setListening] =
    useState(false);

  // ✅ CHAT STATE

  const [messages, setMessages] =
    useState<any[]>([
      {
        role: "assistant",
        content:
          "👋 Hi Uttej! I'm your AI Portfolio Assistant.",
      },
    ]);

  // ======================================================
  // ✅ REFS
  // ======================================================

  const aiRef =
    useRef<HTMLDivElement>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  // ======================================================
  // ✅ SCROLL
  // ======================================================

  const { scrollYProgress } =
    useScroll();

  const scaleX =
    useSpring(scrollYProgress);

  // ======================================================
  // ✅ DATA
  // ======================================================

  const roles = [
    "Software Engineer",
    "React Developer",
    "Creative Frontend Developer",
    "UI Animator",
  ];

  const skills = [
    "ReactJS",
    "Java",
    "Tailwind CSS",
    "TypeScript",
    "Framer Motion",
    "HTML5",
    "CSS3",
    "SQL",
  ];

  const projects: Project[] = [
    {
      title: "BankingDomain",
      desc:
        "FEBA (Finacle E-Banking Application) is a digital banking platform that provides secure online and mobile banking services, enabling customers to perform transactions and manage their accounts anytime, anywhere.",
      image: "/p5.jpg",
    },

    {
      title: "Portfolio",
      desc:
        "Futuristic glassmorphism portfolio showcasing projects, skills, animations, and AI assistant integration.",
      image: "/p2.jpg",
    },

    {
      title: "Spotify Clone",
      desc:
        "Responsive music streaming interface inspired by Spotify with modern UI and smooth user experience..",
      image: "/P4.png",
    },

    {
      title: "Calculator",
      desc:
        "Calculator UI.",
      image: "/P3.png",
    },
  ];

  // ======================================================
  // ✅ ROLE TYPING
  // ======================================================

  useEffect(() => {

    let i = 0;

    const typing = setInterval(() => {

      setText(
        roles[index].slice(0, i + 1)
      );

      i++;

      if (
        i === roles[index].length
      ) {

        clearInterval(typing);

        setTimeout(() => {

          setIndex(
            (prev) =>
              (prev + 1) %
              roles.length
          );

          setText("");

        }, 1000);
      }

    }, 70);

    return () =>
      clearInterval(typing);

  }, [index]);

  // ======================================================
  // ✅ CURSOR EFFECT
  // ======================================================

  useEffect(() => {

    const move = (
      e: MouseEvent
    ) => {

      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener(
      "mousemove",
      move
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        move
      );

  }, []);

  // ======================================================
  // ✅ AUTO SCROLL CHAT
  // ======================================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // ======================================================
  // ✅ CLOSE CHAT ON OUTSIDE CLICK
  // ======================================================

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        aiRef.current &&
        !aiRef.current.contains(
          event.target as Node
        )
      ) {

        setAiOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // ======================================================
  // ✅ SEND MESSAGE
  // ======================================================

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentInput = input;

    setInput("");

    setTyping(true);

    setLoading(true);

    try {

      const response =
        await fetch("/api/chat", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: currentInput,
            history: messages,
          }),
        });

      const data =
        await response.json();

      setTimeout(() => {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply,
          },
        ]);

        setTyping(false);

      }, 1000);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ AI Backend Error.",
        },
      ]);

      setTyping(false);
    }

    setLoading(false);
  };

  // ======================================================
  // ✅ SEND VOICE MESSAGE
  // ======================================================

  const sendVoiceMessage = async (
    transcript: string
  ) => {

    if (!transcript.trim()) return;

    const userMessage = {
      role: "user",
      content: transcript,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setTyping(true);

    try {

      const response =
        await fetch("/api/chat", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: transcript,
            history: messages,
          }),
        });

      const data =
        await response.json();

      setTimeout(() => {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply,
          },
        ]);

        setTyping(false);

      }, 1000);

    } catch {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ Voice AI Error.",
        },
      ]);

      setTyping(false);
    }
  };

  // ======================================================
  // ✅ VOICE INPUT
  // ======================================================

  const startVoice = () => {

    try {

      // @ts-ignore
      const SpeechRecognition =
        // @ts-ignore
        window.SpeechRecognition ||
        // @ts-ignore
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {

        alert(
          "Speech Recognition not supported."
        );

        return;
      }

      const recognition =
        new SpeechRecognition();

      recognition.continuous =
        false;

      recognition.interimResults =
        false;

      recognition.lang = "en-US";

      recognition.start();

      setListening(true);

      recognition.onresult =
        (event: any) => {

          const transcript =
            event.results[0][0]
              .transcript;

          setInput(transcript);

          setListening(false);

          setTimeout(() => {

            sendVoiceMessage(
              transcript
            );

          }, 500);
        };

      recognition.onspeechend =
        () => {

          recognition.stop();

          setListening(false);
        };

      recognition.onerror =
        () => {

          setListening(false);
        };

    } catch {

      setListening(false);
    }
  };

  // ======================================================
  // ✅ UI
  // ======================================================

  return (

    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-500 ${
        darkMode
          ? "bg-black text-white"
          : "bg-slate-100 text-black"
      }`}
    >

      {/* ✅ BACKGROUND */}

      <motion.div
        className="fixed inset-0 -z-30"
        animate={{
          background: darkMode
            ? [
                "linear-gradient(135deg,#020617,#111827)",
                "linear-gradient(135deg,#111827,#1d4ed8)",
              ]
            : [
                "linear-gradient(135deg,#ffffff,#dbeafe)",
                "linear-gradient(135deg,#dbeafe,#ffffff)",
              ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* ✅ GLOW */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-purple-500/20 blur-[120px]" />

      </div>

      {/* ✅ CURSOR */}

      <motion.div
        className="fixed w-32 h-32 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none z-50"
        animate={{
          x: cursor.x - 60,
          y: cursor.y - 60,
        }}
      />

      {/* ✅ PROGRESS BAR */}

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 origin-left z-50"
      />

      {/* ✅ NAVBAR */}

      <nav className="fixed top-0 w-full z-40 px-6 py-5 bg-black/20 backdrop-blur-xl border-b border-white/10">

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-black tracking-widest">
            UTTEJ
          </h1>

          <div className="hidden md:flex gap-8 items-center">

            <a href="#skills">
              Skills
            </a>

            <a href="#projects">
              Projects
            </a>

            <a href="#beyond">
              Beyond
            </a>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="p-3 rounded-full border border-white/20 bg-white/10"
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </motion.button>

          </div>

        </div>

      </nav>

      {/* ✅ HERO */}

      <section className="min-h-screen flex items-center justify-center px-6 text-center">

        <Glass className="p-12 max-w-5xl">

          <motion.img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Uttej"
            alt="avatar"
            className="w-40 h-40 rounded-full mx-auto border-4 border-cyan-400"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <h1 className="mt-8 text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-300 via-white to-blue-400 bg-clip-text text-transparent">
            UTTEJKUMAR
          </h1>

          <p className="mt-6 text-2xl text-cyan-300 h-10">
            {text}
          </p>

        </Glass>

      </section>

      {/* ✅ SKILLS */}

      <section
        id="skills"
        className="py-24 px-6"
      >

        <h2 className="text-5xl font-black text-center mb-20">
          Skills
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {skills.map((skill) => (

            <Glass
              key={skill}
              className="p-8 text-center text-xl font-semibold"
            >
              {skill}
            </Glass>

          ))}

        </div>

      </section>

      {/* ✅ PROJECTS */}

      <section
        id="projects"
        className="py-24 px-6"
      >

        <h2 className="text-5xl font-black text-center mb-20">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          {projects.map((project) => (

            <motion.div
              key={project.title}
              onClick={() =>
                setSelectedProject(project)
              }
            >

              <Glass className="overflow-hidden cursor-pointer">

                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover"
                  whileHover={{
                    scale: 1.05,
                  }}
                />

                <div className="p-6">

                  <h3 className="text-3xl font-bold">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-gray-300">
                    {project.desc}
                  </p>

                </div>

              </Glass>

            </motion.div>

          ))}

        </div>

      </section>
{/* ======================================================
          ✅ BEYOND CODING
      ====================================================== */}

      <section
        id="beyond"
        className="py-24 px-6"
      >

        <h2 className="text-5xl font-black text-center mb-20">
          Beyond Coding ✨
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">

          {/* ✅ LIVE STATUS */}
          <Glass className="p-10">

            <h3 className="text-3xl font-bold mb-10">
              Live Status
            </h3>

            <div className="space-y-5">

              <motion.div
                whileHover={{
                  x: 10,
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                💻 Building futuristic UI
              </motion.div>

              <motion.div
                whileHover={{
                  x: 10,
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                🚀 Exploring motion design
              </motion.div>

              <motion.div
                whileHover={{
                  x: 10,
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                🎧 Music + Coffee + Coding
              </motion.div>

            </div>

          </Glass>

          {/* ✅ TECH UNIVERSE */}
          <Glass className="p-10 flex flex-col items-center">

            <h3 className="text-3xl font-bold mb-10">
              Tech Universe
            </h3>

            <div className="relative w-[320px] h-[320px]">

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >

                {[
                  "⚛️",
                  "🔥",
                  "💻",
                  "🚀",
                  "🎨",
                  "🧠",
                ].map((icon, index) => (

                  <div
                    key={index}
                    className="absolute text-4xl"
                    style={{
                      top: `${50 + 40 * Math.sin((index * Math.PI) / 3)}%`,
                      left: `${50 + 40 * Math.cos((index * Math.PI) / 3)}%`,
                    }}
                  >
                    {icon}
                  </div>

                ))}

              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-24 rounded-full bg-cyan-500/20 backdrop-blur-3xl flex items-center justify-center text-5xl"
              >
                👨‍💻
              </motion.div>

            </div>

          </Glass>

        </div>

      </section>

      {/* ======================================================
          ✅ PROJECT POPUP
      ====================================================== */}

      <AnimatePresence>

        {selectedProject && (

          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex justify-center items-center z-50 p-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            <Glass className="max-w-3xl w-full p-10">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-4xl font-bold">
                  {selectedProject.title}
                </h2>

                <button
                  onClick={() =>
                    setSelectedProject(null)
                  }
                  className="p-3 rounded-full bg-red-500/20"
                >
                  <X />
                </button>

              </div>

              <p className="text-lg leading-9 text-gray-300">
                {selectedProject.desc}
              </p>

            </Glass>

          </motion.div>

        )}

      </AnimatePresence>

      {/* ======================================================
          ✅ AI CHATBOT
      ====================================================== */}

      <>
        {/* ✅ FLOATING BUTTON */}

        <motion.div
          drag
          whileHover={{
            scale: 1.1,
          }}
          className="fixed bottom-8 right-8 z-50 cursor-pointer"
          onClick={() =>
            setAiOpen(true)
          }
        >

          <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-3xl shadow-2xl">
            🤖
          </div>

        </motion.div>

        {/* ✅ CHAT WINDOW */}

        <AnimatePresence>

          {aiOpen && (

            <motion.div

              ref={aiRef}

              drag
              dragMomentum={false}

              initial={{
                opacity: 0,
                scale: 0.8,
                y: 80,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.8,
                y: 80,
              }}

              className="fixed bottom-28 right-8 w-[380px] max-w-[95vw] z-50"
            >

              <Glass
                className={`p-4 flex flex-col ${
                  minimized
                    ? "h-[70px]"
                    : "h-[520px]"
                }`}
              >

                {/* ✅ HEADER */}

                <div className="flex justify-between items-center mb-4">

                  <div>

                    <h2 className="font-bold text-xl">
                      AI Assistant
                    </h2>

                    <p className="text-xs text-cyan-300">
                      GPT Powered Assistant
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        setMinimized(!minimized)
                      }
                      className="p-2 rounded-full bg-yellow-500/20"
                    >
                      <Minus size={16} />
                    </button>

                    <button
                      onClick={() =>
                        setAiOpen(false)
                      }
                      className="p-2 rounded-full bg-red-500/20"
                    >
                      <X size={16} />
                    </button>

                  </div>

                </div>

                {!minimized && (
                  <>
                    {/* ✅ CHAT AREA */}

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">

                      {messages.map(
                        (msg, index) => (

                          <div
                            key={index}
                            className={`flex ${
                              msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >

                            <div
                              className={`
                                max-w-[80%]
                                px-4
                                py-3
                                rounded-2xl
                                text-sm
                                leading-6
                                ${
                                  msg.role === "user"
                                    ? "bg-cyan-500"
                                    : "bg-white/10"
                                }
                              `}
                            >
                              {msg.content}
                            </div>

                          </div>

                        )
                      )}

                      {/* ✅ TYPING */}

                      {typing && (

                        <div className="flex gap-1">

                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                            }}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                          />

                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                            }}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                          />

                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.7,
                            }}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                          />

                        </div>

                      )}

                      {/* ✅ AUTO SCROLL */}

                      <div ref={messagesEndRef} />

                    </div>

                    {/* ✅ INPUT */}

                    <div className="mt-4 flex gap-2">

                      <input
                        value={input}
                        onChange={(e) =>
                          setInput(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter"
                          ) {
                            sendMessage();
                          }
                        }}
                        placeholder="Ask something..."
                        className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                      />

                      {/* ✅ VOICE */}

                      <button
                        onClick={startVoice}
                        className={`px-4 rounded-2xl transition-all ${
                          listening
                            ? "bg-red-500 animate-pulse"
                            : "bg-white/10"
                        }`}
                      >
                        <Mic size={18} />
                      </button>

                      {/* ✅ SEND */}

                      <motion.button
                        whileHover={{
                          scale: 1.05,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                        onClick={sendMessage}
                        disabled={loading}
                        className="px-5 py-3 rounded-2xl bg-cyan-500"
                      >
                        <Send size={18} />
                      </motion.button>

                    </div>
                  </>
                )}

              </Glass>

            </motion.div>

          )}

        </AnimatePresence>
      </>

      {/* ✅ FOOTER */}

      <footer className="py-10 text-center text-gray-400">
        © 2026 UTTEJKUMAR • AI Portfolio 🚀
      </footer>

    </div>
  );
}
