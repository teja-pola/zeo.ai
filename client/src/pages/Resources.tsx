import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Video,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Headphones, // <-- Add this line!
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardSidebar from "@/components/DashboardSidebar";
import axios from "axios";
import { getCurrentRole } from "@/utils/roleTestHelper";

type ResourceTab = "articles" | "guides" | "videos" | "tools" | "faq" | "audios";

type Resource = {
  title: string;
  description: string;
  author?: string;
  avatar?: string;
  date?: string;
  readingTime?: string;
  steps?: string[];
  difficulty?: string;
  category?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  link?: string;
  thumbnail?: string;
  duration?: string;
  body?: string;         // Add this
  authorBio?: string;    // Add this
  audioUrl?: string;     // <-- Fix for audios
};

// Add relaxation audios to translations
const translations: Record<string, Record<ResourceTab, Resource[]>> = {
  en: {
    articles: [
      {
        title: "Mindfulness Basics",
        description:
          "Learn the fundamentals of mindfulness, how to focus on the present, and practical exercises to reduce anxiety.",
        author: "Priya Sharma",
        avatar: "https://i.pravatar.cc/40?img=47",
        date: "Aug 20, 2025",
        readingTime: "5 min read",
        tags: ["Mindfulness", "Focus", "Anxiety"],
        likes: 120,
        comments: 15,
        link: "#",
        body: "Mindfulness is the practice of being present and fully engaged with whatever we are doing at the moment. It helps reduce anxiety and improve focus. <br /><br />**Practical Exercise:**<br />1. Sit comfortably and close your eyes.<br />2. Take a deep breath and focus on the sensation.<br />3. Notice your thoughts without judgment.<br />4. Practice for 5 minutes daily.<br /><br />**Benefits:**<br />- Reduces stress<br />- Improves emotional regulation<br />- Enhances concentration",
        authorBio: "Priya Sharma is a certified mindfulness coach with 10+ years of experience helping people manage stress and improve well-being.",
      },
      {
        title: "Coping with Stress",
        description:
          "Techniques to manage stress effectively, including breathing exercises, journaling, and daily routines.",
        author: "Rahul Verma",
        avatar: "https://i.pravatar.cc/40?img=48",
        date: "Jul 15, 2025",
        readingTime: "7 min read",
        tags: ["Stress", "Wellness", "Self-care"],
        likes: 98,
        comments: 12,
        link: "#",
        body: "Stress can be managed with simple daily habits. <br /><br />**Techniques:**<br />- Practice deep breathing for 5 minutes.<br />- Write down your thoughts in a journal.<br />- Create a daily routine and stick to it.<br /><br />**Benefits:**<br />- Reduces anxiety<br />- Improves sleep<br />- Boosts productivity",
        authorBio: "Rahul Verma is a wellness expert and author, specializing in stress management and self-care routines.",
      },
      {
        title: "Improving Sleep Quality",
        description:
          "Learn habits and strategies to improve your sleep, including sleep hygiene, meditation, and environment optimization.",
        author: "Ananya Iyer",
        avatar: "https://i.pravatar.cc/40?img=49",
        date: "Sep 01, 2025",
        readingTime: "6 min read",
        tags: ["Sleep", "Health", "Routine"],
        likes: 210,
        comments: 25,
        link: "#",
        body: "Quality sleep is essential for mental health. <br /><br />**Tips:**<br />- Maintain a regular sleep schedule.<br />- Avoid screens before bedtime.<br />- Try meditation or gentle yoga.<br /><br />**Benefits:**<br />- Better mood<br />- Increased energy<br />- Improved focus",
        authorBio: "Ananya Iyer is a sleep coach and researcher, helping people develop healthy sleep habits.",
      },
      {
        title: "Building Emotional Resilience",
        description:
          "Practical ways to strengthen your emotional resilience and handle life's challenges with confidence.",
        author: "Amitabh Singh",
        avatar: "https://i.pravatar.cc/40?img=50",
        date: "Aug 28, 2025",
        readingTime: "8 min read",
        tags: ["Resilience", "Mindset", "Growth"],
        likes: 150,
        comments: 20,
        link: "#",
        body: "Emotional resilience helps you bounce back from setbacks. <br /><br />**Strategies:**<br />- Practice positive self-talk.<br />- Build a support network.<br />- Set realistic goals.<br /><br />**Benefits:**<br />- Greater confidence<br />- Better stress management<br />- Personal growth",
        authorBio: "Amitabh Singh is a psychologist and motivational speaker, focused on emotional growth and resilience.",
      },
    ],
    guides: [
      {
        title: "Getting Started with ZEO",
        description:
          "Complete onboarding guide to set up ZEO AI for personal mental wellness.",
        author: "Sneha Reddy",
        avatar: "https://i.pravatar.cc/40?img=51",
        date: "Sep 05, 2025",
        readingTime: "10 min read",
        steps: [
          "Sign up and create your account",
          "Set your personal preferences",
          "Explore the AI chat features",
          "Start daily wellness tracking",
        ],
        difficulty: "Easy",
        category: "Onboarding",
        tags: ["Beginner", "Setup", "AI"],
        likes: 85,
        comments: 10,
        link: "#",
      },
      {
        title: "Daily Wellness Routine",
        description:
          "Step-by-step guide to structure your day for optimal mental health.",
        author: "Vikram Patel",
        avatar: "https://i.pravatar.cc/40?img=52",
        date: "Aug 30, 2025",
        readingTime: "12 min read",
        steps: [
          "Morning mindfulness meditation",
          "Daily mood logging",
          "Exercise and nutrition tips",
          "Evening reflection and journaling",
        ],
        difficulty: "Medium",
        category: "Routine",
        tags: ["Wellness", "Routine", "Mindfulness"],
        likes: 95,
        comments: 14,
        link: "#",
      },
      {
        title: "Managing Anxiety Effectively",
        description:
          "Guided steps to identify triggers and implement coping strategies for anxiety.",
        author: "Meera Nair",
        avatar: "https://i.pravatar.cc/40?img=53",
        date: "Sep 02, 2025",
        readingTime: "15 min read",
        steps: [
          "Identify anxiety triggers",
          "Practice breathing exercises",
          "Engage in daily journaling",
          "Use AI prompts for guided relief",
        ],
        difficulty: "Medium",
        category: "Anxiety",
        tags: ["Anxiety", "Coping", "AI Assistance"],
        likes: 112,
        comments: 20,
        link: "#",
      },
    ],
    videos: [
      {
        title: "Morning Energizing Stretch",
        description: "Quick morning stretches to energize your body and mind.",
        author: "Siddharth Joshi",
        avatar: "https://i.pravatar.cc/40?img=58",
        date: "Sep 07, 2025",
        duration: "05:00",
        thumbnail: "https://i.ytimg.com/vi/sPZAyyNrP3k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCF874XF41UdJveKuUFWWq9HPbvWQ",
        likes: 190,
        comments: 28,
        link: "#",
      },
      {
        title: "10-Min Mindfulness Meditation",
        description:
          "Short guided meditation to help you focus and reduce anxiety in just 10 minutes.",
        author: "Arjun Desai",
        avatar: "https://i.pravatar.cc/40?img=54",
        date: "Aug 12, 2025",
        duration: "10:00",
        thumbnail: "https://th.bing.com/th/id/OIP.9CdJ6taKsM-rljM-eEERNAHaEK?w=320&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" ,
        likes: 200,
        comments: 30,
        link: "#",
      },
      {
        title: "Better Sleep Habits",
        description:
          "Tips and tricks for a healthy sleep routine including bedtime practices and environment optimization.",
        author: "Pooja Menon",
        avatar: "https://i.pravatar.cc/40?img=55",
        date: "Jul 28, 2025",
        duration: "08:00",
        thumbnail: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIWFRUVFRUVFRcWFRUVFxUXFxUWFxUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OFhAQGCsdHh0rLS0tLS0tKystLS0tLS0tKystKy0rLS0tLS0tLS0tLSsrKzUrLSsrLSstKy0tKy0rK//AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA9EAABAwIDBQYDBwQBBAMAAAABAAIRAyEEEjEFQVFhcQYTIoGR8KGxwTJCUmKC0eEHFCNy8VODkuIzQ3P/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIEAwX/xAAfEQEBAAICAgMBAAAAAAAAAAAAAQIRAxIhMRNBUQT/2gAMAwEAAhEDEQA/AOY+Pxn9/tdCHbg7wKRvt7J3j/bX88i9QJh6ezOvmb/mkf8AyBPHu/EDrqBvmW/iAL+V1lO7X56jz1A52H3speotyjlpB8tJ3RBP3ZDUPh5aR6RHlE/d+w0e7/W8zHOY0MOdUMXe+dp1PIb+F5h5i4+/cceVz90mHSPv1t8zw32BlpGB7+A/b1A/AinaffT06ft9ksXR8fh6fSPy6KJf79+nw/Khl/v37/10QO53v6e/QaqJf79++qg8+/fvlvQ3P9+/fNAR1RBL1FzkJzldJsWVEuQ8yYlETzpiUPMmzrWkElQLr/p+qg6oArGytlV8S7/CwkWBebMF/wAX0CsiWq73qWEw1WsYpU3P6Cw6u0C9A2T2Jw9IB1c98/howdG7/NdExoADWtDWjQAQB5LUxYuTznCdiMQ+9RzKY4fad6C3xWvhv6eU5BfWqEDUANE8p1C7LL0U+/i0LWoztkN7N0GRkosBGhyifUo1XZNNwDXU2uB+1IEQtOmG6kyUX+4A0VR5ztb+nrjUNTCvawCHNYZPiBkQ7cNF2+ycY802isw03wAQYInkRIV4V2nUKUjkVdoQdF2meSPSrZhGhQDTabR9EJ1It3z81di+2sRZ3kUR9bQ7tFRZVduMqL68C4InzgoNRjrKJ16KpRxEiAUUO3KCbjKDUfCLKyMXixBM2mB/CgtU8TASWKarjcCPNJTa6cd5e/nMgc5A3gF8T5RHLSPTTyiPukZE53sRpA8oiOURugtafd5mfXWec/mkO5nURPu+s+uo6zwd9qM29Ijh5DqLDoNWJjw9PS3LTrbiJDWn2ennuHP9QuKGn35EDju6/qFhBz/fX5/GfzaCLnDTX+b89fj+b7SE9/vr75/q3NCTn+/fvnuQi/309/8ACg+p79++Y0QH1eauktGfU9+/fVBdUQH1kF9Za0ztaNRDNRVe8kgbzoN56DetbAdm8ZW+xhqgExLx3Q6/5IkdJV6s3JRL0i8cVf2xsM4Uf569IP8A+mxxe/fugR1NuawTi2yQKZcCI8TySPzAtDR6gq9Uua07FNATU3l5AY0uJ0ABJ9Ast0n3or2ydqVcO/PTMEcZ+hC11Z7O52H2FNqmLOsEUWm//cd9B6ruaYDWhjAGtAgACAOgXOdnO1zMSQ17XMqRJ1cw7pDgLdDHmuqY0ai6ePRq+wWsKKxiIGqQaqyGaacN3ESigKdKiXGEFQ0L2n0kqX9qRvEcf4WzSwdk5w44IMc0OZ9P5UchW3/aKD8IgyATwKcVFefSQKohBWcN4Td5OqOGg6odXDA702KrjlkhXMBXmT0VZ+HO4+qFSBpkkixG5XaLe0sXlaYuTYBZdKiTdx6bgOQCmAXuzHyHAKxUsopg0JKAKZQcET78/wB53azaczTG3r04ft8OIHhaffkPp1HUQWwc735z9Z6ncfEfB0pOd79D+x8p4PQ3P+f8/wA/H8yg9/voffD9Jua9Wt79++mqujaT3+/fvrqq76vv376oNWt79++uqq1KvxPx/dakZuSxUre/fvoqtSqug2R2LxeIg5O5YfvVbGOVP7XqAF2+wuwlGh43AVqgIh1QDK0je1lwDzMngQtzFi5POdk9ncXiYNGg4tMeN3gp335nRI/1ldjs3+lVTMDXrAttLGAguvcZybDnE9F6Axj94B/WfqphpH3CR6/IrUjG1TZ2wW4ZobSota0bwBNzq52p11Kyu3e1nYOjlbHfPByk/cbpnPE8BxXTU8dktEeZHwdZeI/1I206ti6rM0tY4AaataGgTyv5kojlMVVc95JJcSSSTqSdSeJTYexmNAVa2RSBfLtACepiwXe/087LMr96+o2WgGmJuJyszeub4FTPLrNtYY9rp5yW3ndvVnD0LT7K7ztD2DNEl1ElwBkNdfyG9UNm9maj9WmmN86eQN1j5Mdbek4ct6UOyWIFKs5jgCKoaL7nMOZhHqQeq9GwmKY6zSWVJIa3MSbbiCYIP1suRxPYx0S2pcaSI9CFp4KjWY0B5zQQQeYuD1BC5+TKW9o6uPGzHrY7ChWkXEEaj6o2ZefbYxFY1W1Q4sytyzTLmzefGJh3nKs0+1VZrb021PzSW+oAP0XtjyzXlz58N3dO2qVQBpJkAAakkwAOcrawuHgX8+q5fslhnV3/ANxUdmDBFLSAXN8TgBacrsvPMeC7VrF7uZDu0RlAEEb+MojWqNA+JwQRY3cUz6aM4XT5UGfUoqvXwYcI9FqVGIOVBgOwjhaDPqFA03jULfeChvHFTSsKeIKg114WvWocFU7qbRP0UFT+3m4gFAxNB24T5rYbg5EE9OSoPHMgjcgyu7qcPl+6S0cw9lJRXmDnxy+evl/zwN3VX1ffT0+mu42JAJt74fxb/wBVWxTCL+/f/H5V5yPehVa3v3/HlvrPqSY42/YLa2P2RxWJghvdUzHjqSJHFrPtO5aDmF6N2f7LUMKJY3M/Q1HQXniB+EchHOVuYvO5OH2D2AxGIh9UmjTN7iahH+h+x+q/Iru9i9lMNhbsplz99RxzVD0P3RybAW73xiBYKIctyMW7PTbTGtM/En4owbS3Fo5OYD8bFDBHX4KbY/6YVRF2FadA2eLHwfQpjgnC4ffgfC71GvorLOTQOjv4T1Kc6tB/UURl4jFODSHXjc6CD5rwXaOHzOLyfteInnN59F9B18A1wu0jmCT8DqPNeKdruzVXBVQXeOg5x7t4045HDc4XtvieMFc9hhEn2V7Z2Bp9xhabXfad43dXEu+q8hpUxnY073D0kC/x+K9n2c+Q0rw5r6jp/nnutjH1RC57EkAgDVxsPmei2C2SsbY1NtStVrO0zmmyTubZxjmflzXj1e/bS3RoBzVTxODI0Wts9ze+rAEZAW+uUT8vmiYjDzcaLOmpk5LE4XksFtAiuxjRPeuDMv5nGAfU+krt8XRiU/ZLYmeucQ4eGnLWc3EQ4+QJH6uSuGO8tJyZ6x26nY2z20aTKbR4WNDRzjUnmTJ81eIU4URqu581IKu8w/qrIVfHNsDwQWCU0pqLpAUigg5DIRCnc1AHKoParBppjTEIKbghVHAIjWgtBlVHtN4aTwO5QO6ss7EtEk8fmtBuEcdTCsUcBTneTzKKxm4VpE5oSXQjCt/CPRJNDwfs9sXE4pw7pkM31HS2mBoYd947obO6bL1jYXYzDYcB7/8ANVEHM8WBAiWMuB1MnnFleo0YAAtwiyuYYX8SkxauVpn4Um8Qgd2tXEVwBAWeWrTIXdhI0xwRMqWVEDyhGZQMclEBEdVKCu+lyUQ1w/F5QrDKJdoUR+DeN8oKwxRbqD5n+FkdoNhsxtJzC4CYIg6EGQdIla7zGpj9KG8efSJ9FFeD7a2PWwtTLWBBOVzHHRwGpB5GLdV6hsDGNfSaQbwAeIIsQeBlam2tlU8Sw06rWubBgHwOBP3mnc4cVyWzeyuJovHdVc4aLtfDXkCzYizxG/UWF4Xjyzfl0cGWty/bsmk6rJpbNMZZhoOjTu+io4zbjg9uHYIqm781hSaIknib2ChWrZarGZic7Sc03kEA9BfReN9OrH26LCtp0WENEbz14rS2Rig+0acQR53WJh25rPOm/jGnmo4HaBLnukCC5gvZrGwbc7T5IWOgxezRVIa0wTqeA3lbWHwrabAxggNED6k8zqhbIpRTDiILwCZ1A+6DwtqOJKtkrp48Os24eXO5XX4G9RARMspFq9HkHKjWuETLCi5AHAOsRwVmFSw5ip1HyV9SALzcKaFihonoVNyok5yjlLt8D3oiGmNYUwgCyg1o09U+9SIQyboCVKcqhWaWmVpBQq0wQgpiokoOokWhJQSNJRyLTNIKrVZCorFiaEVLKqBKJRixNlQAKhKsOYomgeCAmGxACtCtmsFnnDu4ItCW8PVZFirg7LMrUS1bNOpKarSB1CaXbAeJVau06iQRoeC18TgwNLLPqUlmxuVg4rF06lQtrUm98GwHxBc3k7WLm274rKq4B7aneU6QcQIvIIEzZ38ea29sbN71tjle27Ha5Xc73B0I+sJuz+04Jp1m5ajbEajkQd4O5c2c06+PLc8OexPaFjTkrU30ydzmktPRwkIuyqwrV6VNjxle9gc3KbtDgXboHhzDzXSba2fTrjLlBlVuzGxX0cVTENLPEZgBzSGOi41vHNXCS3yueeUx8O+a9IlLKQmdddb552lTphDUmlAUhCexEDk5QZdVsOB4H52/ZaAVHEnxDqFcaVIp3NlVn0eCtKLlUAa8orHKBKYFAZV61Mi4RcykEAaNbiil6r4ilFwo0L9EFiOaSUJILOZVn3KnCbIgFCYhFyJZFQHKnycUUqORBKiwcESpTt+yam6EaVBlv/8AzcfOU3fR/wDWR5BaXd81lbWxHdNc5ziA1pcd9hc2KCGN2gWU3OAvHhkWk2HXVSw8nXEVZ5CkI6DIvH9tbZxOOxJoNqimSC2nSYTmfDcxzvYDAmwG8kW3ovYvC4imancPq1twDA00weLzUeGB4v4WuJveUHreKxDmCXPFRg1loa8XiZbY9ICrVKTTcEgrzftMzbxBike6F4ommahHNrXF08mzpvVHsv29qsr9ziX52yGy8APY6wIzADMAdZE2J5GVY9QfhXcQVibb2UXDMPDUb9l24/lcRuPw15HrsITUbIyx5kg8N0IeKwsXmfRZuMsbxzuNcPsbahB8ViDlcDqCNy7TY2Ia58jXKfouV27s2D3rAA77/wB3OOZ/Fw9Ol3sVXzVSOFN3l4mrnxxuOcjpyymeFv27hygQmzKAF11uISEwUyEsqBmlRqlMbFSqCyDNc7xK/QMhUm09TxPysrNCRuUgM8wguqp6jCTrCcYQbyVRXdUUe9Vl2CbxPqqOKoEHw3CbB21VMPWaHkK3hHymwTGg5CBqYA5SQEWkyABwTOu4DzRYA1KCMp0pCSA5aoopVdzkBITEKLaiIFRCE2VFhSAQVy7g1NndyCO5qDUFkExW4rB7T4+lTpOfWjJo6dCHWyxvmYhXK7zwXmf9WtqmKFIG2Z73AcWtytk8s+nJQZWFwn909tOixuHo1arWCnSjNkb4nPqPF3VHREmcp03z6ns+nTphlKmGhjABlALQGxLcg3jS9983Xln9PdoZcVQaY0dln8U5j5wCvXcbhWVWZXCLGC2xaSIJa4aFSh6VMhusmRfS1gTHqVzHbXshRxg75rQMRRIcSyAarWwTTfxMCxNwbTBV7s1Vr+Nj5qUqbjTpVZbmqZCWnPceLdIABIPKdwkhwMG+vwEfAeim105zs7iHfaNRoY4BxdoI1BuefxXQtxlF4tWB84H/AJfsV41XxVQ4qtRbLmUq1VjdzKbW1HBo4CBA42XQ0MZAguceQ0Xhny9fDpw4JnN7einZ9JwlpDjxBzfG6z9l7PyYrOARNNwPB12xPNc3hajd/wDPkui7MBzqpOd5aGus5znAXEQCbJhzdrJpc+C4Y27dFBPROGqbkgF0uQOlV8Rad1xzBVhVq1GYI+0NP2KJQqz1GoUBHNUXBTUXKirSflaPP5lSLydFDLILfMfVGpU4EKCqad1bosTEKRaqCGOSDUc08FOBCpl11FO/DtKH/aAXBIVhqYA70REW6pZgFGq7ggucqJOxfJOq5ZySUF52IlRD0AIjVoFBU2GEIFPnQWmVJRFTDkRlVBYUXNTteCnUFDHYdztDC89/qVsUuwhqwM1B3eTxafC9p8iDHFoXqMLD7S4YVKL6dRodTeAHA8J4hB4DseqadVheSzKQ4Egy2RZ0bxobfFex9ndtNqsDGkCoNQTMTJD28WTp1XG4/YTmNYzEAllETQrtGYdyImhWH4hIyxqdxvHKYvarTUNVgNMySACfB/qQbHjG8myl8q+iNn4djKYpi4aIMxebknde6ydq40iRTMmBBd93XQfeN9dNNd/GdhNt4t4zVnVKtAsOUuaxviDhEH7TxZwnRdTUPekPc4MaAbA3v+J33eg9V48mevEdHHxT3XK1sKWkyMxJmBxJJJduEmSnfhbAgDS/DoOK64YJobDQL6WgfuVlYnCta6C+XRMamOTRoOa5rHXMmA+kbE2jguk7IY49/kO9jvgWkW4wCsh7AXQPOVf7MU2sxQJIHgfHW1vSVrjl7xOWzpdu8AU4QmPB0RZXc+YioPpzfQ8UVMQgG1+46/AqSg9p4hCbnBvcctQgN3dwUSFBrrSnbUkSEEYunJTgJFqCEqhiHZXK68LM2kbealWLtKtISc+SgUR4R0TsBlBYbQlOcKEek6yIiKOXkkrhYE6DKzBLOotppwFoPmU2hJrFbw9JAJtIpaK6q9dQDBRqboVUvSFVUXw5Ax1HMwiOHpKCMQpHFKDL2m1lvDna4ZSNRykHqR5rltodiMLWdmNIt/0e5oPxt5Qu3p4fMb6K2cKIsg5Gns9tGiKbZFOm2GsDrQNJcZPmsvB4aKjXNAe4HT7QbJ/E4mPVdpXwI3iVXFBrLAAchp6Lzyw29sOXrGc/FOcYe4MaDEA3dxGbUDpB5rSp7Oa5v+NgbN8xEHqTq487pm0mTmFMA8YAlXqGKPD4qfH+tXm/Ipjs5T3kk9Y+SLRwjaVmgDyF+p3q++tZVZnmvSYyenjcrfdKd7ZUhXqD7gPUx+6mGmFHOtMrFGqSBMNPAX9DafRGVMORBU5qA7xZCDvMKFapNpVcRMyZ5GPUCyC44qFN0iyq4okiEPAZmmD9k6cig0gUQFCanCB6hWLtTdzK1KrlRxlPNl/2H8qVYOxsAKYUmpQqhgiNehOTAFQWO9TIKSAJv0U4A1TAk6W+abuePvotB++4BTp1SmFNMUFsVJRAxVqFlaBUFatRVVzCtMhQe0IM8UlIMTVa3AIJzHeqNCg8Dejhyy6dFXGVgFAWownkqdagBukq8wyncyUGRkO9ObaBXq1Hgqr2xuQCa8qxQiVVL9wRaGYXj4hUaLxZV+73qVMg6g+as5RwUGe4lRL1fqUgVUfQQDzJSn7gpu6KoeUnNnen7tLu0EsK5wkEzwRm1VXo79yTnb9/zUFl4kKoftAcJP0+qt1DAQGBBNqNTaoBqKwoE6mq9R8K2hVKQKCka4SUnUhKdRRsu9FpMSSWkNWYhCnCdJAzqoCiMSkkgs03EpqzoCSSgqClKkWQmSVA3lRYCUkkF6iYRgU6SgUqpimykkgqGlwSaXDQpJKgjcQfTVXKNaQkkoJPqwFVdVKZJWCJrKP9wkkgbOeKUHqnSQTw7dYQ8S0tukkpQXvM0QjtakkglCYpkkA3V4SNclJJRVZzTxTJJKD/2Q==",
        likes: 180,
        comments: 25,
        link: "#",
      },
      {
        title: "Stress Relief Exercises",
        description:
          "Practical exercises to relieve stress, including breathing, stretching, and short meditations.",
        author: "Rohan Gupta",
        avatar: "https://i.pravatar.cc/40?img=56",
        date: "Sep 03, 2025",
        duration: "12:00",
        thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTToFtC7Y9ih8Zz7m86WwWcBh9k1DSRsfLVgw&s",
         likes: 150,
        comments: 18,
        link: "#",
      },
      {
        title: "Evening Yoga Routine",
        description:
          "A calming yoga routine to wind down and improve sleep quality.",
        author: "Lakshmi Pillai",
        avatar: "https://i.pravatar.cc/40?img=57",
        date: "Sep 05, 2025",
        duration: "15:00",
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZsrUapcH2IzFUwgYCPsNGcaaU-ot0TpmE9A&s",
        likes: 170,
        comments: 22,
        link: "#",
      },
    ],
    tools: [
      {
        title: "Habit Builder",
        description:
          "Track and build positive habits with reminders and streak tracking for better mental health.",
        link: "#",
      },
      {
        title: "Mood Tracker",
        description:
          "Log your emotions daily, visualize trends, and monitor your mental well-being over time.",
        link: "#",
      },
      {
        title: "Daily Journal",
        description:
          "Reflect on your thoughts and activities each day to improve self-awareness and mindfulness.",
        link: "#",
      },
      {
        title: "Mindfulness Timer",
        description:
          "Set timers for meditation, breathing exercises, or focus sessions to enhance mindfulness practice.",
        link: "#",
      },
      {
        title: "Gratitude Log",
        description:
          "Record daily gratitudes to cultivate positivity and boost overall mood.",
        link: "#",
      },
    ],
    faq: [
      {
        title: "How do I reset my password?",
        description:
          "To reset your password, navigate to Settings > Account > Reset Password. Follow the on-screen instructions to create a new password.",
      },
      {
        title: "Is ZEO free to use?",
        description:
          "Core features of ZEO are free to use. Premium tools and advanced features may require a subscription.",
      },
      {
        title: "How can I track my mental wellness progress?",
        description:
          "Use tools like Mood Tracker, Daily Journal, and Habit Builder to log your activities, emotions, and habits. Analyze trends over time for better insights.",
      },
      {
        title: "Can I access ZEO on mobile devices?",
        description:
          "Yes! ZEO is fully accessible via web browsers on mobile devices. Mobile apps are also available for enhanced experience.",
      },
      {
        title: "Is my data secure?",
        description:
          "We take your privacy seriously. All personal data is encrypted and securely stored, ensuring confidentiality and protection.",
      },
      {
        title: "How do I contact support?",
        description:
          "You can contact our support team via the Help section in the app or email us at support@zeo.com.",
      },
      {
        title: "Can I share my account with others?",
        description:
          "No, each account is personal. Sharing your login may result in restricted access or data loss.",
      },
      {
        title: "Are there premium features?",
        description:
          "Yes, premium features include advanced analytics, personalized recommendations, and priority support.",
      },
    ],
    audios: [
      {
        title: "Calm Ocean Waves",
        description: "Relax with soothing ocean wave sounds.",
        author: "ZEO Relax",
        avatar: "https://i.pravatar.cc/40?img=60",
        date: "Sep 11, 2025",
        duration: "10:00",
        thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        likes: 120,
        comments: 10,
      },
      {
        title: "Gentle Rain",
        description: "Let gentle rain help you unwind.",
        author: "ZEO Relax",
        avatar: "https://i.pravatar.cc/40?img=61",
        date: "Sep 10, 2025",
        duration: "15:00",
        thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        likes: 98,
        comments: 8,
      },
      {
        title: "Forest Birds",
        description: "Enjoy peaceful forest birds chirping.",
        author: "ZEO Relax",
        avatar: "https://i.pravatar.cc/40?img=62",
        date: "Sep 09, 2025",
        duration: "12:00",
        thumbnail: "https://th.bing.com/th/id/OIP.hqRW2JpJeLnd-v669AOEJwHaEc?w=305&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        likes: 110,
        comments: 12,
      },
    ],
  },
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("articles");
  const [lang, setLang] = useState("en");
  const [realArticle, setRealArticle] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Resource | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Resource | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(null);
  const [playingVideoIdx, setPlayingVideoIdx] = useState<number | null>(null);
  const [toolsModalOpen, setToolsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Resource | null>(null);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<Resource | null>(null);
  const [userRole, setUserRole] = useState<"student" | "counsellor">("student");
  // Add state for add modals
  const [addModalOpen, setAddModalOpen] = useState<null | ResourceTab>(null);
  // Add state for resources
  const [resources, setResources] = useState(translations[lang]);

  useEffect(() => {
    // Try to get from localStorage (userType or userRole)
    const storedRole = localStorage.getItem("userType") || getCurrentRole();
    if (storedRole === "counsellor" || storedRole === "student") {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "articles") {
      setLoading(true);
      setError(null);
      fetch("https://api.example.com/articles/1")
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          setRealArticle({
            title: data.title,
            description: data.description,
            author: data.author,
            avatar: data.avatar,
            date: data.date,
            readingTime: data.readingTime,
            tags: data.tags,
            likes: data.likes,
            comments: data.comments,
            link: data.link,
          });
          setLoading(false);
        })
        .catch(() => {
          // Fallback to mock data if API fails
          setRealArticle({
            title: "Mindfulness Basics (Live Demo)",
            description: "Learn the fundamentals of mindfulness, how to focus on the present, and practical exercises to reduce anxiety.",
            author: "Priya Sharma",
            avatar: "https://i.pravatar.cc/40?img=47",
            date: "Aug 20, 2025",
            readingTime: "5 min read",
            tags: ["Mindfulness", "Focus", "Anxiety"],
            likes: 120,
            comments: 15,
            link: "#",
            body: "Mindfulness is the practice of being present and fully engaged with whatever we are doing at the moment. It helps reduce anxiety and improve focus. <br /><br />**Practical Exercise:**<br />1. Sit comfortably and close your eyes.<br />2. Take a deep breath and focus on the sensation.<br />3. Notice your thoughts without judgment.<br />4. Practice for 5 minutes daily.<br /><br />**Benefits:**<br />- Reduces stress<br />- Improves emotional regulation<br />- Enhances concentration",
            authorBio: "Priya Sharma is a certified mindfulness coach with 10+ years of experience helping people manage stress and improve well-being.",
          });
          setLoading(false);
          setError(null);
        });
    }
  }, [activeTab]);

  const tabs: { id: ResourceTab; icon: React.ReactNode; label: string }[] = [
    { id: "articles", icon: <FileText className="h-5 w-5" />, label: "Articles" },
    { id: "guides", icon: <BookOpen className="h-5 w-5" />, label: "Guides" },
    { id: "videos", icon: <Video className="h-5 w-5" />, label: "Videos" },
    { id: "audios", icon: <Headphones className="h-5 w-5" />, label: "Relaxation Audios" }, // <-- Changed icon here!
    { id: "tools", icon: <Lightbulb className="h-5 w-5" />, label: "Tools" },
    { id: "faq", icon: <HelpCircle className="h-5 w-5" />, label: "FAQ" },
  ];

  // Simple Modal Component
  const ArticleModal = ({ article, open, onClose }: { article: Resource | null; open: boolean; onClose: () => void }) => {
    if (!open || !article) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <img src={article.avatar} alt={article.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{article.author}</div>
              <div className="text-sm text-muted-foreground">{article.date} • {article.readingTime}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="mb-4">{article.description}</p>
          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {article.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {article.comments}
            </span>
          </div>
          {/* Show author bio if available */}
          {article.authorBio && (
            <div className="mb-4">
              <span className="font-semibold">About the author:</span>
              <p className="text-sm text-muted-foreground">{article.authorBio}</p>
            </div>
          )}
          {/* Show full article body */}
          {article.body && (
            <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: article.body }} />
          )}
          {/* Show steps if available */}
          {article.steps && (
            <div className="mb-4">
              <span className="font-semibold">Practical Steps:</span>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                {article.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          {/* Social share (example) */}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Bookmark</Button>
          </div>
        </div>
      </div>
    );
  };

  // Add this inside your Resources component, after ArticleModal:
  const GuideModal = ({ guide, open, onClose }: { guide: Resource | null; open: boolean; onClose: () => void }) => {
    if (!open || !guide) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <img src={guide.avatar} alt={guide.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{guide.author}</div>
              <div className="text-sm text-muted-foreground">{guide.date} • {guide.readingTime}</div>
            </div>
          </div>
                   <h2 className="text-2xl font-bold mb-2">{guide.title}</h2>
          <p className="mb-4">{guide.description}</p>
          {guide.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {guide.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {guide.category && (
            <div className="mb-2 text-xs text-zeo-primary font-semibold">{guide.category}</div>
          )}
          {guide.difficulty && (
            <div className="mb-2 text-xs text-muted-foreground">Difficulty: {guide.difficulty}</div>
          )}
          {/* Show steps if available */}
          {guide.steps && (
            <div className="mb-4">
              <span className="font-semibold">Steps:</span>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                {guide.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {guide.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {guide.comments}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Bookmark</Button>
          </div>
        </div>
      </div>
    );
  };

  // Video Modal Component
  const VideoModal = ({ video, open, onClose }: { video: Resource | null; open: boolean; onClose: () => void }) => {
    if (!open || !video) return null;

    // Try to extract YouTube video ID from thumbnail or add a videoUrl field to your Resource type
    let videoSrc = "";
    if (video.thumbnail?.includes("youtube.com") || video.thumbnail?.includes("youtu.be")) {
      // If thumbnail is a YouTube link, use it
      videoSrc = video.thumbnail.replace("watch?v=", "embed/");
    } else if (video.thumbnail?.includes("i.ytimg.com")) {
      // If thumbnail is a YouTube image, use a sample video ID (replace with your own logic)
      videoSrc = "https://www.youtube.com/embed/sPZAyyNrP3k";
    } else if (video.link && video.link.startsWith("http")) {
      // If you have a direct video link
      videoSrc = video.link;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <div className="mb-4">
            {videoSrc.includes("youtube.com") ? (
              <iframe
                width="100%"
                height="315"
                src={videoSrc}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            ) : videoSrc ? (
              <video controls width="100%" className="rounded-lg">
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={video.thumbnail} alt={video.title} className="w-full h-56 object-cover rounded-lg" />
            )}
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <img src={video.avatar} alt={video.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{video.author}</div>
              <div className="text-sm text-muted-foreground">{video.date} • {video.duration}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
          <p className="mb-4">{video.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {video.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {video.comments}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Bookmark</Button>
          </div>
        </div>
      </div>
    );
  };

  const AudioModal = ({ audio, open, onClose }: { audio: Resource | null; open: boolean; onClose: () => void }) => {
    if (!open || !audio) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <div className="mb-4">
            <img src={audio.thumbnail} alt={audio.title} className="w-full h-56 object-cover rounded-lg mb-4" />
            <audio controls autoPlay className="w-full">
              <source src={audio.audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <img src={audio.avatar} alt={audio.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{audio.author}</div>
              <div className="text-sm text-muted-foreground">{audio.date} • {audio.duration}</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{audio.title}</h2>
          <p className="mb-4">{audio.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {audio.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {audio.comments}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Bookmark</Button>
          </div>
        </div>
      </div>
    );
  };

  const ToolsModal = ({ tool, open, onClose }: { tool: Resource | null; open: boolean; onClose: () => void }) => {
    const [mood, setMood] = useState("");
    const [journal, setJournal] = useState("");
    const [habits, setHabits] = useState<string[]>([]);
    const [newHabit, setNewHabit] = useState("");
    const [timer, setTimer] = useState<number>(0);
    const [timerActive, setTimerActive] = useState(false);
    const [newTimer, setNewTimer] = useState<number>(0);
    const [gratitudes, setGratitudes] = useState<string[]>([]);
    const [newGratitude, setNewGratitude] = useState("");

    const today = new Date().toISOString().slice(0, 10);
    const [journalInput, setJournalInput] = useState("");
    const [journalEntries, setJournalEntries] = useState<{ date: string; text: string }[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
      const stored = localStorage.getItem("zeo_journal_entries");
      if (stored) setJournalEntries(JSON.parse(stored));
    }, []);

    // Save to localStorage whenever journalEntries changes
    useEffect(() => {
      localStorage.setItem("zeo_journal_entries", JSON.stringify(journalEntries));
    }, [journalEntries]);

    // Habits
    useEffect(() => {
      const stored = localStorage.getItem("zeo_habits");
      if (stored) setHabits(JSON.parse(stored));
    }, []);

    useEffect(() => {
      localStorage.setItem("zeo_habits", JSON.stringify(habits));
    }, [habits]);

    // Gratitudes
    useEffect(() => {
      const stored = localStorage.getItem("zeo_gratitudes");
      if (stored) setGratitudes(JSON.parse(stored));
    }, []);

    useEffect(() => {
      localStorage.setItem("zeo_gratitudes", JSON.stringify(gratitudes));
    }, [gratitudes]);

    const prompts = [
      "What made you smile today?",
      "Describe a challenge you overcame.",
      "Write about someone you appreciate.",
      "What are you grateful for today?",
      "How did you take care of yourself today?",
      "What's a goal you want to achieve?",
      "Reflect on a positive moment from today.",
    ];
    const [showPrompt, setShowPrompt] = useState(false);
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Timer logic
    useEffect(() => {
      let interval: NodeJS.Timeout | undefined;
      if (timerActive && timer > 0) {
        interval = setInterval(() => setTimer((t) => t - 1), 1000);
      } else if (timer === 0) {
        setTimerActive(false);
      }
      return () => interval && clearInterval(interval);
    }, [timerActive, timer]);

    if (!open || !tool) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative z-10"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">{tool.title}</h2>
          <p className="mb-4">{tool.description}</p>
          {tool.title === "Mood Tracker" && (
            <div>
              <label className="block mb-2 font-medium">How are you feeling today?</label>
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
              >
                <option value="">Select mood</option>
                <option value="Happy">😊 Happy</option>
                <option value="Sad">😢 Sad</option>
                <option value="Stressed">😟 Stressed</option>
                <option value="Excited">😃 Excited</option>
                <option value="Calm">😌 Calm</option>
              </select>
              {mood && <div className="mb-2">You logged: <b>{mood}</b></div>}
              <Button variant="outline" size="sm" onClick={() => setMood("")}>Clear</Button>
            </div>
          )}
          {tool.title === "Daily Journal" && (
            <div>
              <label className="block mb-2 font-medium">Journal for <b>{today}</b>:</label>
              <textarea
                value={journalInput}
                onChange={e => setJournalInput(e.target.value)}
                rows={5}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type your thoughts for today..."
              />
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (journalInput.trim()) {
                      setJournalEntries((entries) => {
                        const others = entries.filter(entry => entry.date !== today);
                        return [...others, { date: today, text: journalInput.trim() }];
                      });
                      setJournalInput("");
                    }
                  }}
                  disabled={!journalInput.trim()}
                >
                  Add Entry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompt(true)}
                >
                  Need Inspiration?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setJournalEntries(entries => entries.filter(entry => entry.date !== today));
                    setJournalInput("");
                  }}
                  disabled={!journalEntries.find(e => e.date === today)}
                >
                  Clear Today's Entry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setJournalEntries([])}
                  disabled={journalEntries.length === 0}
                >
                  Clear All
                </Button>
              </div>
              {showPrompt && (
                <div className="mb-4 p-2 bg-muted rounded text-sm text-muted-foreground">
                  <b>Prompt:</b> {randomPrompt}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => setShowPrompt(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
              {journalEntries.length > 0 && (
                <div>
                  <div className="font-semibold mb-2">Previous Entries:</div>
                  <ul className="list-disc ml-5">
                    {journalEntries
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((entry, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>
                            <span className="font-mono text-xs text-muted-foreground">{entry.date}:</span>
                            <span className="ml-2">{entry.text}</span>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setJournalEntries(journalEntries.filter((_, idx) => idx !== i))}
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {tool.title === "Habit Builder" && (
            <div>
              <label className="block mb-2 font-medium">Add a new habit:</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newHabit}
                  onChange={e => setNewHabit(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="e.g. Drink water"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newHabit.trim()) {
                      setHabits([...habits, newHabit.trim()]);
                      setNewHabit("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {habits.length > 0 && (
                <ul className="list-disc ml-5 mb-2">
                  {habits.map((h, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>{h}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHabits(habits.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="outline" size="sm" onClick={() => setHabits([])}>Clear All</Button>
            </div>
          )}
          {tool.title === "Mindfulness Timer" && (
            <div>
              <label className="block mb-2 font-medium">Set timer (seconds):</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min={1}
                  value={timerActive ? timer : newTimer}
                  onChange={e => setNewTimer(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-24"
                  disabled={timerActive}
                  placeholder="60"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newTimer > 0) {
                      setTimer(newTimer);
                      setTimerActive(true);
                    }
                  }}
                  disabled={timerActive || newTimer < 1}
                >
                  Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimerActive(false);
                    setTimer(0);
                    setNewTimer(0);
                  }}
                  disabled={!timerActive}
                >
                  Stop
                </Button>
              </div>
              {timerActive && timer > 0 && (
                <div className="mb-2 font-bold text-lg">Time left: {timer}s</div>
              )}
              {!timerActive && timer === 0 && (
                <div className="mb-2 text-green-600">Timer finished!</div>
              )}
            </div>
          )}
          {tool.title === "Gratitude Log" && (
            <div>
              <label className="block mb-2 font-medium">Add something you're grateful for:</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newGratitude}
                  onChange={e => setNewGratitude(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="e.g. Family"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newGratitude.trim()) {
                      setGratitudes([...gratitudes, newGratitude.trim()]);
                      setNewGratitude("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {gratitudes.length > 0 && (
                <ul className="list-disc ml-5 mb-2">
                  {gratitudes.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              )}
              <Button variant="outline" size="sm" onClick={() => setGratitudes([])}>Clear All</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add handler to add resource
  const handleAddResource = (resource: Resource) => {
    setResources(prev => ({
      ...prev,
      [addModalOpen!]: [resource, ...prev[addModalOpen!]],
    }));
  };

  // Add Resource Modal
  const AddResourceModal = ({
    open,
    onClose,
    resourceType,
    onAdd,
  }: {
    open: boolean;
    onClose: () => void;
    resourceType: ResourceTab;
    onAdd: (resource: Resource) => void;
  }) => {
    const [form, setForm] = useState<any>({});
    if (!open) return null;

    // Simple fields for demo; can be expanded per type
    const fields: { label: string; name: string; type?: string }[] =
      resourceType === "articles"
        ? [
            { label: "Title", name: "title" },
            { label: "Description", name: "description" },
            { label: "Author", name: "author" },
          ]
        : resourceType === "guides"
        ? [
            { label: "Title", name: "title" },
            { label: "Description", name: "description" },
            { label: "Author", name: "author" },
          ]
        : resourceType === "videos"
        ? [
            { label: "Title", name: "title" },
            { label: "Description", name: "description" },
            { label: "Author", name: "author" },
            { label: "Thumbnail URL", name: "thumbnail" },
          ]
        : resourceType === "audios"
        ? [
            { label: "Title", name: "title" },
            { label: "Description", name: "description" },
            { label: "Author", name: "author" },
            { label: "Audio URL", name: "audioUrl" },
          ]
        : resourceType === "tools"
        ? [
            { label: "Title", name: "title" },
            { label: "Description", name: "description" },
          ]
        : resourceType === "faq"
        ? [
            { label: "Question", name: "title" },
            { label: "Answer", name: "description" },
          ]
        : [];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative z-10"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">Add {resourceType.slice(0, -1)}</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              onAdd(form);
              setForm({});
              onClose();
            }}
            className="space-y-4"
          >
            {fields.map(f => (
              <div key={f.name}>
                <label className="block mb-1 font-medium">{f.label}</label>
                <input
                  type={f.type || "text"}
                  className="border rounded px-3 py-2 w-full"
                  value={form[f.name] || ""}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  required
                />
              </div>
            ))}
            <button type="submit" className="bg-zeo-primary text-white px-4 py-2 rounded">Add</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content - 81% width with left margin for sidebar */}
      <div className="ml-[15%] w-[84%] p-6">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-zeo-primary to-zeo-secondary bg-clip-text text-transparent mb-2">
              Resources
            </h1>
            <p className="text-muted-foreground">Helpful articles, tools & more</p>
          </div>

          {/* Resource Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-zeo-primary text-white"
                    : "bg-card text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Header */}
          <motion.div
            key={activeTab + lang}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{tabs.find((t) => t.id === activeTab)?.label}</h2>
                <p className="text-muted-foreground">
                  {activeTab === "articles" &&
                    "Explore insightful and practical articles on mental health."}
                  {activeTab === "guides" &&
                    "Step-by-step guides to improve your mental wellness and daily routines."}
                  {activeTab === "videos" && "Watch tutorials and mindfulness sessions."}
                  {activeTab === "tools" && "Use tools to improve well-being."}
                  {activeTab === "faq" && "Find answers to common questions."}
                  {activeTab === "audios" && "Listen to relaxing audio tracks."}
                </p>
              </div>
              {userRole === "counsellor" && (
                <Button
                  variant="default"
                  onClick={() => setAddModalOpen(activeTab)}
                  className="ml-4"
                >
                  + Add {tabs.find((t) => t.id === activeTab)?.label.slice(0, -1)}
                </Button>
              )}
            </div>

            {/* Resources Grid / List */}
            {activeTab === "videos" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources[activeTab].map((video, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-shadow p-0 overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideoModalOpen(true);
                    }}
                  >
                    <div className="relative group">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-0.5 rounded text-xs z-10">
                        {video.duration}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 z-10">
                        <Play className="w-12 h-12 text-white drop-shadow-lg" />
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={video.avatar}
                          alt={video.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-semibold">{video.author}</div>
                          <div className="text-xs text-muted-foreground">{video.date}</div>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold mb-1">{video.title}</CardTitle>
                      <CardDescription className="mb-2">{video.description}</CardDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {video.comments}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Video Modal */}
                <VideoModal video={selectedVideo} open={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
              </div>
            ) : activeTab === "tools" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources[activeTab].map((res, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTool(res);
                      setToolsModalOpen(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{res.title}</CardTitle>
                      <CardDescription>{res.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {/* Tools Modal */}
                <ToolsModal tool={selectedTool} open={toolsModalOpen} onClose={() => setToolsModalOpen(false)} />
              </div>
            ) : activeTab === "guides" ? (
              <div className="flex flex-col gap-6">
                {resources[activeTab].map((guide, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <img src={guide.avatar} alt={guide.author} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <span className="font-medium">{guide.author}</span>
                          <span className="text-sm text-muted-foreground">
                            {guide.date} • {guide.readingTime} {guide.difficulty && `• ${guide.difficulty}`}
                          </span>
                          {guide.category && <span className="text-xs text-zeo-primary mt-1">{guide.category}</span>}
                          {guide.tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {guide.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 md:mt-0">
                        {guide.likes !== undefined && (
                          <div className="flex items-center text-sm text-muted-foreground space-x-1">
                            <Heart className="w-4 h-4" /> <span>{guide.likes}</span>
                          </div>
                        )}
                        {guide.comments !== undefined && (
                          <div className="flex items-center text-sm text-muted-foreground space-x-1">
                            <MessageCircle className="w-4 h-4" /> <span>{guide.comments}</span>
                          </div>
                        )}
                        {guide.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedGuide(guide);
                              setGuideModalOpen(true);
                            }}
                          >
                            Read More
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Guides Modal */}
                <GuideModal guide={selectedGuide} open={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
              </div>
            ) : activeTab === "audios" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources[activeTab].map((audio, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-shadow p-0 overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedAudio(audio);
                      setAudioModalOpen(true);
                    }}
                  >
                    <div className="relative group">
                      <img
                        src={audio.thumbnail}
                        alt={audio.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-0.5 rounded text-xs z-10">
                        {audio.duration}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 z-10">
                        <Play className="w-12 h-12 text-white drop-shadow-lg" />
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={audio.avatar}
                          alt={audio.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-semibold">{audio.author}</div>
                          <div className="text-xs text-muted-foreground">{audio.date}</div>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold mb-1">{audio.title}</CardTitle>
                      <CardDescription className="mb-2">{audio.description}</CardDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {audio.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {audio.comments}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Audio Modal */}
                <AudioModal audio={selectedAudio} open={audioModalOpen} onClose={() => setAudioModalOpen(false)} />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {activeTab === "articles" ? (
                  <div className="flex flex-col gap-6">
                    {[realArticle, ...resources[activeTab].slice(1)]
                      .filter(Boolean)
                      .map((article, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle>{article.title}</CardTitle>
                            <CardDescription>{article.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-4">
                            <div className="flex items-center space-x-3">
                              <img src={article.avatar} alt={article.author} className="w-12 h-12 rounded-full object-cover" />
                              <div className="flex flex-col">
                                <span className="font-medium">{article.author}</span>
                                <span className="text-sm text-muted-foreground">
                                  {article.date} • {article.readingTime}
                                </span>
                                {article.tags && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {article.tags.map((tag, i) => (
                                      <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3 md:mt-0">
                              <div className="flex items-center text-sm text-muted-foreground space-x-1">
                                <Heart className="w-4 h-4" /> <span>{article.likes}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground space-x-1">
                                <MessageCircle className="w-4 h-4" /> <span>{article.comments}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedArticle(article);
                                  setModalOpen(true);
                                }}
                              >
                                Read More
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {/* Article Modal */}
                    <ArticleModal article={selectedArticle} open={modalOpen} onClose={() => setModalOpen(false)} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {resources[activeTab].map((res, idx) => (
                      <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>{res.title}</CardTitle>
                          <CardDescription>{res.description}</CardDescription>
                        </CardHeader>
                        {res.author && (
                          <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-4">
                            <div className="flex items-center space-x-3">
                              <img src={res.avatar} alt={res.author} className="w-12 h-12 rounded-full object-cover" />
                              <div className="flex flex-col">
                                <span className="font-medium">{res.author}</span>
                                <span className="text-sm text-muted-foreground">
                                  {res.date} • {res.readingTime} {res.difficulty && `• ${res.difficulty}`}
                                </span>
                                {res.category && <span className="text-xs text-zeo-primary mt-1">{res.category}</span>}
                                {res.steps && (
                                  <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                    {res.steps.map((step, i) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ol>
                                )}
                                {res.tags && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {res.tags.map((tag, i) => (
                                      <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3 md:mt-0">
                              {res.likes !== undefined && (
                                <div className="flex items-center text-sm text-muted-foreground space-x-1">
                                  <Heart className="w-4 h-4" /> <span>{res.likes}</span>
                                </div>
                              )}
                              {res.comments !== undefined && (
                                <div className="flex items-center text-sm text-muted-foreground space-x-1">
                                  <MessageCircle className="w-4 h-4" /> <span>{res.comments}</span>
                                </div>
                              )}
                              {res.link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedArticle(res);
                                    setModalOpen(true);
                                  }}
                                >
                                  Read More
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {/* Modal for Article Details */}
      <ArticleModal article={selectedArticle} open={modalOpen} onClose={() => setModalOpen(false)} />
      <AddResourceModal
        open={!!addModalOpen}
        onClose={() => setAddModalOpen(null)}
        resourceType={addModalOpen as ResourceTab}
        onAdd={handleAddResource}
      />
    </div>
  );
}
