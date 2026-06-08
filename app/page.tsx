"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import { Moon, Sun, X } from "lucide-react";

// ✅ Glass Card Component
function Glass({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`${className || ""}
      rounded-3xl
      backdrop-blur-xl
      border
      border-white/10
      bg-white/5
      shadow-2xl
      p-6`}
    >
      {children}
    </motion.div>
  );
}

type ProjectType = {
  title: string;
  desc: string;
  image: string;
};

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  // ✅ Dark Mode
  const [darkMode, setDarkMode] = useState(true);

  // ✅ Project Popup
  const [selectedProject, setSelectedProject] =
    useState<ProjectType | null>(null);

  const roles = [
    "Software Engineer",
    "Java Developer",
    "React Developer",
  ];

  // ✅ Scroll Animation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  // ✅ Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Typing Animation
  useEffect(() => {
    let i = 0;

    const typing = setInterval(() => {
      setText(roles[index].slice(0, i + 1));
      i++;

      if (i === roles[index].length) {
        clearInterval(typing);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % roles.length);
          setText("");
        }, 1000);
      }
    }, 70);

    return () => clearInterval(typing);
  }, [index]);

  // ✅ Cursor Glow
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ✅ Email Function
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    emailjs
      .sendForm(
        "service_atyalxg",
        "template_052cwpr",
        form,
        "qDxulvQQBkObSX-lb"
      )
      .then(() => {
        alert("✅ Message Sent Successfully!");
        form.reset();
      })
      .catch((err: unknown) => {
        console.error(err);
        alert("❌ Failed to Send Message!");
      });
  };

  // ✅ Skills
  const skills = [
    "Java",
    "React",
    "Next.js",
    "SQL",
    "TypeScript",
    "Tailwind CSS",
    "Finacle",
    "Framer Motion",
  ];

  // ✅ Projects
  const projects: ProjectType[] = [
    {
      title: "Bank App",
      desc: "Core banking solution using Finacle.",
      image: "/p1.png",
    },
    {
      title: "Employee System",
      desc: "Employee management application.",
      image: "/p2.png",
    },
    {
      title: "E-Commerce",
      desc: "Shopping platform with cart functionality.",
      image: "/p3.png",
    },
    {
      title: "Task Manager",
      desc: "Task tracking productivity application.",
      image: "/p4.png",
    },
  ];

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-500 ${
        darkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      {/* ✅ Animated Background */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: darkMode
            ? [
                "linear-gradient(120deg,#020617,#0f172a,#1e293b)",
                "linear-gradient(120deg,#0f172a,#1e40af,#020617)",
              ]
            : [
                "linear-gradient(120deg,#dbeafe,#ffffff,#bfdbfe)",
                "linear-gradient(120deg,#ffffff,#bfdbfe,#dbeafe)",
              ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* ✅ Cursor Glow */}
      <motion.div
        className="fixed w-12 h-12 rounded-full bg-blue-500/20 blur-2xl pointer-events-none z-50"
        animate={{
          x: cursor.x - 20,
          y: cursor.y - 20,
        }}
      />

      {/* ✅ Scroll Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
      />

      {/* ✅ Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
          >
            <motion.h1
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="text-4xl font-bold text-white"
            >
              Loading...
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Navbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full flex justify-between items-center px-6 py-5 bg-white/5 backdrop-blur-xl z-40"
      >
        <h1 className="font-bold text-xl">
          UTTEJKUMAR
        </h1>

        <div className="flex items-center gap-6">
          <a href="#skills" className="hover:text-blue-400">
            Skills
          </a>

          <a href="#projects" className="hover:text-blue-400">
            Projects
          </a>

          <a href="#contact" className="hover:text-blue-400">
            Contact
          </a>

          {/* ✅ Dark Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-blue-500"
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>
      </motion.div>

      {/* ✅ Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold"
        >
          Build. Create. Inspire 🚀
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-5 text-blue-400 text-2xl"
        >
          {text}
        </motion.p>

        {/* ✅ Apple Style Floating Glow */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
          className="mt-16 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"
        />
      </section>

      {/* ✅ Skills */}
      <section
        id="skills"
        className="py-20 px-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10"
        >
          Skills
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
              }}
            >
              <Glass>
                {skill}
              </Glass>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Projects */}
      <section
        id="projects"
        className="py-20 px-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10"
        >
          Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() =>
                setSelectedProject(project)
              }
              className="group rounded-3xl overflow-hidden cursor-pointer bg-white/5"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-zinc-900 rounded-3xl overflow-hidden max-w-2xl w-full"
            >
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedProject.title}
                  </h2>

                  <button
                    onClick={() =>
                      setSelectedProject(null)
                    }
                    className="bg-red-500 p-2 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-gray-300 mt-4">
                  {selectedProject.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Contact */}
      <section
        id="contact"
        className="py-20 px-6 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10"
        >
          Contact
        </motion.h2>

        <Glass className="max-w-xl mx-auto">
          <form onSubmit={sendEmail}>
            <input
              type="text"
              name="user_name"
              placeholder="Name"
              className="w-full mb-4 p-3 rounded bg-black/20"
              required
            />

            <input
              type="email"
              name="user_email"
              placeholder="Email"
              className="w-full mb-4 p-3 rounded bg-black/20"
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              className="w-full mb-4 p-3 rounded bg-black/20"
              required
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 px-6 py-3 rounded-xl w-full"
            >
              Send Message
            </motion.button>
          </form>

          <p className="mt-6 text-blue-400">
            yourgmail@gmail.com
          </p>
        </Glass>
      </section>

      {/* ✅ Footer */}
      <footer className="text-center py-8 text-gray-400">
        🚀 Premium Apple-Inspired Portfolio
      </footer>
    </div>
  );
}