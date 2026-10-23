import About from "../components/About.jsx";
import Header from "../components/Header.jsx";
import Skills from "../components/Skills.jsx";
import { skills } from "../data/portfolio.js";
import { studentConfig } from "../data/studentConfig.js";

export default function Home() {
  return (
    <>
      <Header
        name={studentConfig.name}
        tagline={studentConfig.tagline}
      />
      <About
        education={`B.Tech Computer Engineering · Faculty of ${studentConfig.faculty}`}
        university={studentConfig.university}
        summary={studentConfig.bio}
        experience="Full-Stack Web Development, Modern Frameworks & API Architecture"
      />
      <Skills skillGroups={skills} />
    </>
  );
}
